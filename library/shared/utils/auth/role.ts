// shared/auth-utils.ts
//@ts-expect-error
import { type SecureSessionData, type UnregisteredSecureSessionData } from "#auth-utils";
import { type AllRoles } from "@@/shared/types/v1/role";

/**
 * Core function to check if a user has the specified role(s)
 * Works with both arrays of roles and role objects with primary_role/roles properties
 * 
 * @param {AllRoles[] | { primary_role?: AllRoles, roles?: AllRoles[] } | null | undefined} userRoles - User roles to check
 * @param {AllRoles | AllRoles[]} requiredRoles - Role or array of roles to check against
 * @param {boolean} requireAll - If true, user must have ALL specified roles; if false, user only needs ONE of the roles
 * @returns {boolean} - True if user has the required role(s), false otherwise
 */
export function checkRole(
    userRoles: AllRoles[] | { primary_role?: AllRoles, roles?: AllRoles[] } | null | undefined,
    requiredRoles: AllRoles | AllRoles[],
    requireAll: boolean = false
  ): boolean {
    // Handle missing user roles
    if (!userRoles) {
      return false;
    }
    
    // Handle missing required roles
    if (!requiredRoles) {
      return false;
    }
    
    // Normalize requiredRoles to array
    const rolesToCheck = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    
    // If no roles to check, return false
    if (rolesToCheck.length === 0) {
      return false;
    }
    
    // For array format (client-side format)
    if (Array.isArray(userRoles)) {
      if (requireAll) {
        // User must have ALL required roles
        return rolesToCheck.every(role => userRoles.includes(role));
      } else {
        // User needs at least ONE of the required roles
        return rolesToCheck.some(role => userRoles.includes(role));
      }
    }
    
    // For object format with primary_role/roles properties (server-side format)
    // Convert server-side format to a single array of roles for easier checking
    const allUserRoles: AllRoles[] = [];
    
    // Add primary role if it exists
    if (userRoles.primary_role) {
      allUserRoles.push(userRoles.primary_role);
    }
    
    // Add roles array if it exists
    if (userRoles.roles && Array.isArray(userRoles.roles)) {
      allUserRoles.push(...userRoles.roles);
    }
    
    if (requireAll) {
      // User must have ALL required roles
      return rolesToCheck.every(role => allUserRoles.includes(role));
    } else {
      // User needs at least ONE of the required roles
      return rolesToCheck.some(role => allUserRoles.includes(role));
    }
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