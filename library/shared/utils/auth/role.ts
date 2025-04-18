// shared/auth-utils.ts
//@ts-expect-error
import { type SecureSessionData, type UnregisteredSecureSessionData } from "#auth-utils";
import { type AllRoles } from "@@/shared/types/v1/role";

/**
 * Core function to check if a user has the specified role(s)
 * Works with both arrays of roles and role objects with primary_role/roles properties
 * 
 * @param {AllRoles[] | { primary_role?: AllRoles, roles?: AllRoles[] }} userRoles - User roles to check
 * @param {AllRoles | AllRoles[]} requiredRoles - Role or array of roles to check against
 * @returns {boolean} - True if user has any of the required roles, false otherwise
 */
export function checkRole(
  userRoles: AllRoles[] | { primary_role?: AllRoles, roles?: AllRoles[] },
  requiredRoles: AllRoles | AllRoles[]
): boolean {
  // Handle missing required roles
  if (!requiredRoles) {
    return false;
  }

  // Normalize requiredRoles to array
  const rolesToCheck = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  
  // Handle role array format (client-side format)
  if (Array.isArray(userRoles)) {
    return rolesToCheck.some(role => userRoles.includes(role));
  }
  
  // Handle object format with primary_role/roles properties (server-side format)
  // Check primary role first
  if (userRoles.primary_role && rolesToCheck.includes(userRoles.primary_role)) {
    return true;
  }
  
  // Then check roles array if it exists
  if (userRoles.roles && Array.isArray(userRoles.roles)) {
    return rolesToCheck.some(role => userRoles.roles?.includes(role));
  }
  
  return false;
}

/**
 * Server-side role checking function
 * 
 * @param {SecureSessionData | UnregisteredSecureSessionData} secureSession - User session data
 * @param {AllRoles | AllRoles[]} roles - Role or array of roles to check against
 * @returns {boolean} - True if user has the role, false otherwise
 */
export function hasRole(
  secureSession: SecureSessionData | UnregisteredSecureSessionData, 
  roles: AllRoles[] | AllRoles
): boolean {
  if (!roles) {
    if (import.meta.server) {
      if (import.meta.dev) {
        throw createError({
          statusCode: 500,
          message: 'Validation rules not provided'
        });
      } else {
        throw createError({
          statusCode: 500,
          message: 'Validation rules not provided'
        });
      }
    } else if (import.meta.client || import.meta.browser) {
      console.error('isRole: No roles provided');
      return false;
    }
    return false;
  }
  
  return checkRole(secureSession, roles);
}

/**
 * Client-side role checking function
 * 
 * @param {AllRoles[] | null | undefined} userRoles - Array of user roles
 * @param {AllRoles} role - Role to check against
 * @returns {boolean} - True if user has the role, false otherwise
 */
export function hasClientRole(
  userRoles: AllRoles[] | null | undefined,
  role: AllRoles
): boolean {
  if (!userRoles) return false;
  return checkRole(userRoles, role);
}