import type { H3Event } from "h3";

import { DatabaseService } from "~~/server/services/databaseService";

import type { DBUserWithRoles } from "@@/shared/types/v1/user";
import { validateDBUserWithRoles } from "@@/shared/schemas/v1/user";



const FUNCTION_NAME = 'get-db-user-with-roles';
/**
 * Cached function to get limited user information with roles by email
 * 
 * @event H3Event - The H3 event object (for edge workers)
 * @param email User email
 * @returns User with role information or undefined if not found
 */
export const getCachedDBUserWithRolesByEmail = defineCachedFunction(async (event: H3Event, user_email: string): Promise<DBUserWithRoles | undefined> => {
    const db = DatabaseService.getInstance();

    try {
        if (!user_email) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Email is required'
            });
        }

        // Get basic user data
        const userResult = await db.query<DBUserWithRoles>(`
            SELECT
                u.*,
                COALESCE(
                    (SELECT array_agg(role_name ORDER BY (role_name = u.primary_role) DESC)
                     FROM (
                        SELECT DISTINCT r.name as role_name
                        FROM private.user_role ur2
                        JOIN private.role r ON ur2.role_id = r.id
                        WHERE ur2.user_id = u.id
                     ) AS distinct_roles),
                    ARRAY[]::text[]
                ) AS roles
            FROM private.user u
            WHERE u.email = $1
            `, [user_email]);
       
        if (userResult.length === 0) {
            return undefined;
        }
       
        // Filter out null values from roles array (in case user has no roles)
        return validateDBUserWithRoles(userResult[0]);
    }
    catch (error: unknown) {
        console.error('Error fetching user with roles from database:', error);

        throw error
    }
}, {
    maxAge: 3600,
    name: FUNCTION_NAME,
    getKey: (event: H3Event, user_email: string) => `user-db-roles-${user_email}`,
    integrity: process.env.LIMITED_USER_ROLES_VERSION || '3',
});

export async function invalidateCachedDBUserWithRolesByEmail(user_email: string) {
    await invalidateNitroFunctionCache(FUNCTION_NAME, `user-db-roles-${user_email}`);
}