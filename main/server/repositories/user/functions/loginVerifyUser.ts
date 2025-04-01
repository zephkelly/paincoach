import type { H3Event } from "h3";

import { DatabaseService } from "~~/server/services/databaseService";

import type { UserLoginVerificationData } from "@@/shared/types/v1/user/login/ verify";
import { userLoginVerificationDataValidator } from "@@/shared/schemas/v1/user/login/verify";



/**
 * 
 * @event H3Event - The H3 event object (for edge workers)
 * @param email User email
 * @returns User with role information or undefined if not found
 */
export async function getUserLoginVerificationData(user_email: string): Promise<UserLoginVerificationData | undefined> {
    const db = DatabaseService.getInstance();

    try {
        if (!user_email) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Email is required'
            });
        }

        // Get basic user data
        const userResult = await db.query<UserLoginVerificationData>(`
            SELECT
                u.id,
                u.public_id,
                u.email,
                u.password_hash,
                u.first_name,
                u.verified,
                u.profile_url,
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
            LIMIT 1
            `, [user_email]);
       
        if (userResult.length === 0) {
            return undefined;
        }
       
        // Filter out null values from roles array (in case user has no roles)
        return userLoginVerificationDataValidator.validate(userResult[0]);
    }
    catch (error: unknown) {
        console.error('Error fetching user with roles from database:', error);

        throw error
    }
};