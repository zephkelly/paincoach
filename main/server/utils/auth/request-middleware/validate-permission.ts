import { H3Event } from 'h3';
import type { UserSession } from '#auth-utils';
import { getUserSessionContext } from '~~/server/utils/auth/session/getSession';
import type { Permission } from '@@/shared/types/v1/permission';
import { getPermissionsContext } from '../../permission/getPermissionsContext';



/**
 * Type for permission requirements that can be:
 * - A single permission string
 * - An array of permission strings (user needs at least one)
 * - An object with keys as groups and values as arrays of permissions (user needs at least one from each group)
 */
export type PermissionRequirement = 
  | Permission 
  | Permission[] 
  | Record<string, Permission[]>;

/**
 * Middleware to validate if a user has required permissions
 *
 * @param event - H3 event object
 * @param requiredPermissions - Can be a single permission string, array of permission strings, or object with grouped permission arrays
 * @param options - Optional configuration settings 
 * @returns Promise<void> - Returns void if validation passes, throws an error otherwise
 */
export const onRequestValidatePermission = async (
    event: H3Event,
    requiredPermissions: PermissionRequirement,
    options: { requireAll?: boolean } = {}
): Promise<void> => {
    const { requireAll = false } = options;
    
    // Get user session
    const { session } = await getUserSessionContext(event) as { session: UserSession };
    
    if (!session || !session.secure) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized',
        });
    }
    
    // Get user permissions
    const userPermissions = await getPermissionsContext(event, session.secure.id);

    if (!userPermissions || userPermissions.length === 0) {
        throw createError({
            statusCode: 403,
            message: 'No permissions assigned',
        });
    }

    // Case 1: Single permission string
    if (typeof requiredPermissions === 'string') {
        if (!userPermissions.includes(requiredPermissions)) {
            throw createError({
                statusCode: 403,
                message: `You need the '${requiredPermissions}' permission to access this resource`,
            });
        }
        return;
    }


    
    // Case 2: Array of permission strings
    if (Array.isArray(requiredPermissions)) {
        const hasPermission = requireAll
            ? requiredPermissions.every(permission => userPermissions.includes(permission))
            : requiredPermissions.some(permission => userPermissions.includes(permission));
        
        if (!hasPermission) {
            console.log('User Permissions:', userPermissions);
            throw createError({
                statusCode: 403,
                message: requireAll
                    ? 'You need all required permissions to access this resource'
                    : 'You need at least one of the required permissions to access this resource',
            });
        }
        return;
    }
    
    // Case 3: Object with groups of permission arrays
    // User must have at least one permission from each group
    const permissionGroups = Object.entries(requiredPermissions);
    
    for (const [groupName, permissions] of permissionGroups) {
        const hasGroupPermission = permissions.some(permission => 
            userPermissions.includes(permission)
        );
        
        if (!hasGroupPermission) {
            throw createError({
                statusCode: 403,
                message: `You need at least one permission from the '${groupName}' group to access this resource`,
            });
        }
    }
};