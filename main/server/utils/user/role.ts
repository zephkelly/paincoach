import { type SecureSessionData } from "#auth-utils";
import { type Role } from "@@/shared/types/v1/role";



/**
 * Check if the user has the specified role(s)
 * Will check primary_role first, then check the roles array if not found in primary
 * @param {SecureSessionData} secureSession - User session data
 * @param {Role | Role[]} roles - Role or array of roles to check against
 * @returns {boolean} - True if user has the role, false otherwise
 */
export function hasRole(secureSession: SecureSessionData, roles: Role[] | Role): boolean {
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
            console.error('isRole: No roles provided');
            return false;
        }
        return false;
    }
    
    const rolesToCheck = Array.isArray(roles) ? roles : [roles];
    
    if (rolesToCheck.includes(secureSession.primary_role)) {
        return true;
    }
    
    if (secureSession.roles && Array.isArray(secureSession.roles)) {
        for (const role of rolesToCheck) {
            if (secureSession.roles.includes(role)) {
                return true;
            }
        }
    }
    
    return false;
}