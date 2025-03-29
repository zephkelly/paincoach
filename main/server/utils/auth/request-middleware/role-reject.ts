import { type H3Event } from 'h3';
import type { SecureSessionData } from '#auth-utils';
import type { AllRoles } from '@@/shared/types/v1/role';

import { getUserSessionContext } from '../session/getSession';



/**
 * Middleware to reject if the user has any of the specified roles
 * @param event - The H3Event
 * @param rejectedRoles - Single role or array of roles that are NOT allowed to access the route
 * @param rejectAll - If true, reject only if user has ALL of the rejectedRoles; if false, reject if user has ANY of the roles
 */
export async function onRequestRejectRole(
    event: H3Event,
    rejectedRoles: AllRoles[] | AllRoles,
    rejectAll: boolean = false
) {
    const secureSession = (await getUserSessionContext(event)).session?.secure as SecureSessionData;
   
    // Make sure the user has roles
    if (!secureSession.roles || secureSession.roles.length === 0) {
        await clearUserSession(event);
        throw createError({
            statusCode: 403,
            message: 'Malformed session'
        });
    }
   
    // Convert single role to array for consistent handling
    const roles = Array.isArray(rejectedRoles) ? rejectedRoles : [rejectedRoles];
   
    // Check if user has any/all of the rejected roles
    const hasRejectedRoles = rejectAll
        ? roles.every(role => secureSession.roles.includes(role))
        : roles.some(role => secureSession.roles.includes(role));
   
    // If user has the rejected role(s), throw an error
    if (hasRejectedRoles) {
        throw createError({
            statusCode: 403,
            message: 'This resource is not available for your role'
        });
    }
}