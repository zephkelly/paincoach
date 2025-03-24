import { type H3Event } from 'h3';
import type { SecureSessionData, UserSession } from '#auth-utils';
import type { Role } from '@@/shared/types/v1/role';

import { isValidRole } from '~~/server/utils/user/role';


/**
 * Middleware to validate if the user has one of the allowed roles
 * @param event - The H3Event
 * @param allowedRoles - Single role or array of roles that are allowed to access the route
 * @param requireAll - If true, user must have ALL of the allowedRoles; if false, ANY role is sufficient
 */
export async function onRequestValidateRole(
    event: H3Event, 
    allowedRoles: Role[] | Role,
    requireAll: boolean = false
) {
    const secureSession = (await getUserSession(event)).secure as SecureSessionData;
    
    // Make sure the user has roles
    if (!secureSession.roles || secureSession.roles.length === 0) {
        await clearUserSession(event);
        throw createError({
            statusCode: 403,
            message: 'Malformed session'
        });
    }
    
    // Convert single role to array for consistent handling
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    
    // Check if admin is automatically allowed (maintain your existing behavior)
    const isAdmin = secureSession.roles.includes('admin');
    if (isAdmin && !requireAll) {
        return; // Admin is allowed unless requireAll is true
    }
    
    // Validate roles based on requireAll parameter
    const hasRequiredRoles = requireAll
        ? roles.every(role => secureSession.roles.includes(role))
        : roles.some(role => secureSession.roles.includes(role));
    
    if (!hasRequiredRoles) {
        throw createError({
            statusCode: 403,
            message: 'Unauthorized'
        });
    }
}