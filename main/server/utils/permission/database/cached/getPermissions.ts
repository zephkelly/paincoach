import { DatabaseService } from "~~/server/services/databaseService";

import type { Permission } from "@@/shared/types/v1/permission/index";
import { validatePermissions } from "@@/shared/schemas/v1/permission";


/**
 * Cached function to get all permissions for a user
 * 
 * @param userId - User ID to get permissions for
 * @returns Promise<PermissionString[]> - Array of permission strings
 */
export const getUserPermissions = defineCachedFunction(async (userId: number | bigint): Promise<Permission[]> => {
    const db = DatabaseService.getInstance();
    const permissions = await db.query<Permission>(`
        SELECT DISTINCT p.resource_type || ':' || p.action as permission
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
    `, [userId]);

    // This is safer than trying to parse the whole array at once
    return validatePermissions(permissions);
}, {
    maxAge: 3600, // Cache for 1 hour
    name: 'getUserPermissions',
    getKey: (userId) => `user-${userId}`,
    // Invalidate cache when roles/permissions change
    integrity: process.env.PERMISSIONS_VERSION || '1',
});