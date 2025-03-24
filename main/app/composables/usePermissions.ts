// composables/usePermissions.ts
import { useState, useAsyncData } from '#app';
import { PERMISSIONS, validatePermissions } from '@@/shared/schemas/v1/permission';

import type { Permission } from '@@/shared/types/v1/permission';



export function usePermissions() {
    const {
        primaryRole
    } = useAuth();

  // Create a reactive state for permissions
  const permissions = useState<Permission[]>('user-permissions', () => []);
  
  // Type-safe fetch permissions function
  const fetchPermissions = async () => {
    if (!primaryRole.value || primaryRole.value === 'unregistered') {
        return;
    }

    const { data, error } = await useAsyncData('permissions', () => 
      $fetch('/api/v1/auth/permissions')
    );
    
    if (error.value) {
      console.error('Error fetching permissions:', error.value);
      return [];
    }
    
    // Validate permissions with Zod
    try {
      const validatedPermissions = validatePermissions(data.value);
      permissions.value = validatedPermissions;
      return validatedPermissions;
    } catch (validationError) {
      console.error('Invalid permissions data:', validationError);
      return [];
    }
  };
  
  // Type-safe permission checker
  const hasPermission = (permission: Permission): boolean => {
    return permissions.value?.includes(permission) || false;
  };
  
  // Check if user has any of the permissions
  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };
  
  // Check if user has all of the permissions
  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  };
  
  // Get highest level of access for a specific user role
  const getHighestUserAccess = (userRole: 'owner' | 'admin' | 'clinician' | 'patient'): 'full' | 'limited' | 'basic' | null => {
    if (hasPermission(PERMISSIONS.USER_VIEW[userRole.toUpperCase() as keyof typeof PERMISSIONS.USER_VIEW].FULL)) {
      return 'full';
    }
    if (hasPermission(PERMISSIONS.USER_VIEW[userRole.toUpperCase() as keyof typeof PERMISSIONS.USER_VIEW].LIMITED)) {
      return 'limited';
    }
    if (hasPermission(PERMISSIONS.USER_VIEW[userRole.toUpperCase() as keyof typeof PERMISSIONS.USER_VIEW].BASIC)) {
      return 'basic';
    }
    return null;
  };
  
  // Check if user can manage a specific user role
  const canManageUser = (userRole: 'owner' | 'admin' | 'clinician' | 'patient'): boolean => {
    return hasPermission(PERMISSIONS.USER_MANAGE[userRole.toUpperCase() as keyof typeof PERMISSIONS.USER_MANAGE]);
  };
  
  // Check if user can view clinician-patient data
//   const canAccessPatient = async (patientId: number): Promise<{
//     accessLevel: 'full' | 'limited' | 'basic' | null,
//     canManage: boolean
//   }> => {
//     const user = useState('user');
//     const userRole = user.value?.primary_role;
    
//     // For owners and admins, use general patient permissions
//     if (userRole === 'owner' || userRole === 'admin') {
//       return {
//         accessLevel: getHighestUserAccess('patient'),
//         canManage: canManageUser('patient')
//       };
//     }
    
//     // For clinicians, check if this is their patient
//     if (userRole === 'clinician') {
//       try {
//         // Call API to check if relationship exists
//         const { data } = await useFetch(`/api/v1/relationships/clinician-patient/${patientId}/check`);
        
//         if (data.value?.isMyPatient) {
//           return {
//             accessLevel: hasPermission(PERMISSIONS.USER_VIEW.CLINICIAN_PATIENT.FULL) 
//               ? 'full' 
//               : hasPermission(PERMISSIONS.USER_VIEW.CLINICIAN_PATIENT.LIMITED)
//                 ? 'limited'
//                 : hasPermission(PERMISSIONS.USER_VIEW.CLINICIAN_PATIENT.BASIC)
//                   ? 'basic'
//                   : null,
//             canManage: hasPermission(PERMISSIONS.USER_MANAGE.CLINICIAN_PATIENT)
//           };
//         }
//       } catch (error) {
//         console.error('Error checking clinician-patient relationship:', error);
//       }
      
//       // If not their patient or error, fall back to general patient permissions
//       return {
//         accessLevel: getHighestUserAccess('patient'),
//         canManage: canManageUser('patient')
//       };
//     }
    
//     // For other roles
//     return {
//       accessLevel: getHighestUserAccess('patient'),
//       canManage: canManageUser('patient')
//     };
//   };
  
  return {
    permissions,
    fetchPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getHighestUserAccess,
    canManageUser,
    // canAccessPatient,
    PERMISSIONS
  };
}