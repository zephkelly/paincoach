import type { H3Event } from 'h3';
import { DatabaseService } from "~~/server/services/databaseService";
import { invalidateNitroFunctionCache } from "~~/server/utils/cache/nitro";

import type { Permission } from "@@/shared/types/v1/permission/index";
import { validatePermissions } from "@@/shared/schemas/v1/permission";



const FUNCTION_NAME = 'get-user-permissions';
/**
 * Cached function to get all permissions for a user
 * 
 * @param userId - User ID to get permissions for
 * @returns Promise<PermissionString[]> - Array of permission strings
 */
export const getCachedPermissions = defineCachedFunction(async (event: H3Event, user_id: string): Promise<Permission[]> => {
    const db = DatabaseService.getInstance();

    try {
        const result = await db.query<{ permissions: string[] }>(`
            SELECT COALESCE(array_agg(DISTINCT
                p.resource_type ||
                COALESCE(':' || p.resource_subtype, '') ||
                ':' || p.action ||
                COALESCE(':' || p.action_subtype, '') ||
                ':' || p.access_level ||
                COALESCE(':' || p.access_level_subtype, '')
            ), ARRAY[]::text[]) as permissions
            FROM private.permission p
            WHERE
            -- Role-based permissions
            p.id IN (
                SELECT rp.permission_id
                FROM private.user u
                JOIN private.user_role ur ON u.id = ur.user_id
                JOIN private.role_permission rp ON ur.role_id = rp.role_id
                WHERE u.id = $1
            )
            -- User-specific permissions
            OR p.id IN (
                SELECT up.permission_id
                FROM private.user_permission up
                WHERE up.user_id = $1
            )
        `, [user_id]);
    
        const permissions: string[] | undefined = result[0]?.permissions;

        if (!permissions) {
            return [];
        }
    
        return validatePermissions(permissions);
    }
    catch (error: unknown) {
        console.error('Error fetching permissions from database:', error);
        throw createError({
            statusCode: 500,
            message: 'Internal Server Error',
        });
    }

}, {
    maxAge: 3600,
    name: FUNCTION_NAME,
    getKey: (event: H3Event, user_id: string) => `user-${user_id}`,
    integrity: process.env.PERMISSIONS_VERSION || '3',
});

export async function invalidateCachedPermissions (user_id: string) {
    await invalidateNitroFunctionCache(FUNCTION_NAME, `user-${user_id}`);
}