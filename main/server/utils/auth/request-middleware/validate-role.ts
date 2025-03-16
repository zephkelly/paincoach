import { type H3Event } from 'h3';
import type { SecureSessionData } from '#auth-utils';
import type { UserRole } from '@@/shared/types/users';

import { isValidRole } from '~~/server/utils/user/role';


/**
 * Middleware to validate if the user has one of the allowed roles
 * @param event - The H3Event
 * @param allowedRoles - Single role or array of roles that are allowed to access the route
 * @param admin - If true, will allow admin roles to access the route
 */
export async function onRequestValidateRole(event: H3Event, allowedRoles: UserRole[] | UserRole) {
    const secureSession = (await getUserSession(event)).secure as SecureSessionData;

    if (!secureSession.user_role) {
        await clearUserSession(event);
        throw createError({
            statusCode: 403,
            message: 'Malformed session'
        });
    }

    if (!isValidRole(allowedRoles, secureSession)) {
        throw createError({
            statusCode: 403,
            message: 'Unauthorized'
        });
    }
}