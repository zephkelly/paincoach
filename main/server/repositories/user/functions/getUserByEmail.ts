import type { H3Event } from "h3";

import { DatabaseService } from "~~/server/services/databaseService";

import type { LimitedUserWithRoles } from "@@/shared/types/v1/user/limited";
import { validateLimitedUserWithRoles } from "@@/shared/schemas/v1/user/limited";



const FUNCTION_NAME = 'get-minimal-user-with-roles';
/**
 * Cached function to get limited user information with roles by email
 * 
 * @event H3Event - The H3 event object (for edge workers)
 * @param email User email
 * @returns User with role information or undefined if not found
 */
export const getCachedLimitedUserWithRolesByEmail = defineCachedFunction(async (event: H3Event, user_email: string): Promise<LimitedUserWithRoles | undefined> => {
    const db = DatabaseService.getInstance();

    try {
        if (!user_email) {
            throw new Error('User email is required');
        }

        const userResult = await db.query<LimitedUserWithRoles>(`
            SELECT
                u.public_id,
                u.email,
                u.profile_url,
                u.first_name,
                u.last_name,
                u.status,
                u.created_at,
                u.primary_role,
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
        return validateLimitedUserWithRoles(userResult[0]);
    }
    catch (error: unknown) {
        console.error('Error fetching user with roles from database:', error);

        throw error
    }
}, {
    maxAge: 3600,
    name: FUNCTION_NAME,
    getKey: (event: H3Event, user_email: string) => `user-limited-roles-${user_email}`,
    integrity: process.env.LIMITED_USER_ROLES_VERSION || '1',
});

export async function invalidateCachedLimitedUserWithRolesByEmail(user_email: string) {
    await invalidateNitroFunctionCache(FUNCTION_NAME, `user-limited-roles-${user_email}`);
}