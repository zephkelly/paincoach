import { H3Event } from 'h3'
import type { UserSession, SecureSessionData, User } from '#auth-utils';
import { type AllRoles } from '@@/shared/types/v1/role';



export async function getPainCoachSession(event: H3Event) {
    const session = await getUserSession(event) as UserSession;
    const secureSession = session.secure as SecureSessionData;
    const userSession = session.user as User;
    
    const user_id: number | bigint = secureSession.user_id;
    
    // Get all user roles
    const roles: AllRoles[] = secureSession.roles;
    
    // Get primary role - prefer primary_role if available, fall back to user_role
    const primaryRole: AllRoles = secureSession.primary_role;
    
    // Role checks - can check either against primary role or any role
    const hasRole = (role: AllRoles | AllRoles[], checkPrimaryOnly: boolean = false): boolean => {
        const rolesToCheck = Array.isArray(role) ? role : [role];
        
        if (checkPrimaryOnly) {
            // Check only against the primary role
            return rolesToCheck.includes(primaryRole);
        } else {
            // Check against any of the user's roles
            return rolesToCheck.some(r => roles.includes(r));
        }
    };
    
    const isAdmin = primaryRole === 'admin' || roles.includes('admin');
    const isClinician = primaryRole === 'clinician';
    const isPatient = primaryRole === 'patient';
    const isUnregistered = primaryRole === 'unregistered';
    
    // New role checks (against all roles)
    const hasAdminRole = roles.includes('admin');
    const hasClinicianRole = roles.includes('clinician');
    const hasPatientRole = roles.includes('patient');
    
    return {
        session,
        secureSession,
        userSession,
        
        user_id,
        
        // Legacy single role support
        role: primaryRole,
        
        // Multi-role support
        roles,
        primaryRole,
        
        /**
         * Check if the user has a specific role or roles
         * @param role - Role or array of roles to check
         * @param checkPrimaryOnly - If true, only checks against primary role
         * @returns {boolean}
         */
        hasRole,
        
        /**
         * Check if the user's primary role is admin
         */
        isAdmin,
        
        /**
         * Check if the user's primary role is clinician
         */
        isClinician,
        
        /**
         * Check if the user's primary role is patient
         */
        isPatient,
        
        /**
         * Check if the user's primary role is incomplete_user
         */
        isUnregistered,
        
        /**
         * Check if the user has admin role (regardless of primary)
         */
        hasAdminRole,
        
        /**
         * Check if the user has clinician role (regardless of primary)
         */
        hasClinicianRole,
        
        /**
         * Check if the user has patient role (regardless of primary)
         */
        hasPatientRole,
    }
}