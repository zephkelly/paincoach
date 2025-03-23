import { type SecureSessionData } from "#auth-utils";
import { type Role } from "@@/shared/types/users";


/**
 * Check if the user has the specified role, will always return true
 * for admin roles unless admin is set to false
 * @param {Role | Role[]} roles
 * @param {SecureSessionData} secureSession
 * @returns {boolean}
 */
export function isValidRole(roles: Role[] | Role, secureSession: SecureSessionData): boolean {
    if (!roles) {
        if (import.meta.server) {
            if (import.meta.dev) {
                throw createError({
                    statusCode: 500,
                    message: 'Validation rules not provided'
                });
            }
            else {
                throw createError({
                    statusCode: 500,
                    message: 'Validation rules not provided'
                });
            }
        }
        else if (import.meta.client || import.meta.browser) {
            console.error('isRole: No roles provided')
        }
    }

    if (Array.isArray(roles)) {
        return roles.includes(secureSession.user_role);
    }

    return roles.includes(secureSession.user_role);
}