// server/utils/auth/request-middleware/validate-permission.ts
import { H3Event } from 'h3';
import type { UserSession } from '#auth-utils';
import { getUserSessionContext } from '~~/server/utils/auth/session/getSession';

import type { Permission } from '@@/shared/types/v1/permission';
import { getPermissionsContext } from '../../permission/getPermissionsContext';



/**
 * Middleware to validate if a user has required permissions
 * 
 * @param event - H3 event object
 * @param requiredPermissions - Array of permission strings to check for
 * @param requireAll - If true, user must have all permissions. If false, user only needs one of the permissions.
 * @returns Promise<boolean> - Returns true if validation passes, throws an error otherwise
 */
export const onRequestValidatePermission = async (
    event: H3Event, 
    requiredPermissions: Permission[], 
    requireAll: boolean = false,
): Promise<void> => {
    const { session } = await getUserSessionContext(event) as { session: UserSession };
    
    if (!session || !session.secure) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized',
        });
    }

    const permissions = await getPermissionsContext(event, session.secure.id);

    // Check permissions based on requireAll flag
    const hasPermission = requireAll
        ? requiredPermissions.every(permission => permissions.includes(permission))
        : requiredPermissions.some(permission => permissions.includes(permission));
    
    if (!hasPermission) {
        throw createError({
            statusCode: 403,
            message: requireAll
                ? 'You need all required permissions to access this resource'
                : 'You need at least one of the required permissions to access this resource',
        });
    }
    
    return;
};