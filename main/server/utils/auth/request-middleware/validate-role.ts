import { type H3Event } from 'h3';
import type { UserSession } from '#auth-utils';
import type { UserRole } from '@@/shared/types/users';



/**
 * Middleware to validate if the user has one of the allowed roles
 * @param event - The H3Event
 * @param allowedRoles - Single role or array of roles that are allowed to access the route
 */
export async function onRequestValidateRole(event: H3Event, allowedRoles: UserRole[] | UserRole) {
    if (!allowedRoles) {
        throw createError({
            statusCode: 500,
            message: 'Validation rules not provided'
        });
    }
    
    const roles = new Set(Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]);
    roles.add('super_admin');
    roles.add('admin');
    
    const session = await getUserSession(event) as UserSession;
    const role = session?.secure?.user_role;
    
    if (!role) {
        await clearUserSession(event);
        throw createError({
            statusCode: 403,
            message: 'Malformed session'
        });
    }
    
    if (!roles.has(role)) {
        throw createError({
            statusCode: 403,
            message: 'Unauthorized'
        });
    }
}