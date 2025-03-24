import { z } from 'zod';
import { createZodValidationError } from '@@/shared/utils/zod/error';

export const ResourceTypeEnum = z.enum([
  'invitation',
  'user:owner',
  'user:admin',
  'user:clinician',
  'user:patient',
  'user:clinician-patient'
]);

export const InvitationActionEnum = z.enum([
  'invite:owner',
  'invite:admin',
  'invite:clinician',
  'invite:patient'
]);

export const UserViewActionEnum = z.enum([
  'view:full',
  'view:limited',
  'view:basic'
]);

export const UserManageActionEnum = z.enum([
  'manage'
]);

export const ActionEnum = z.union([
  InvitationActionEnum,
  UserViewActionEnum,
  UserManageActionEnum
]);

// Permission format: resource_type:action
export const PermissionFormatSchema = z.string().refine(
  (val) => {
    const parts = val.split(':');
    return parts.length >= 2;
  },
  {
    message: "Permission must be in format 'resource_type:action' or 'resource_type:subtype:action'"
  }
);

// Type-safe permission constants
export const PERMISSIONS = {
    INVITATION: {
      INVITE_OWNER: 'invitation:invite:owner',
      INVITE_ADMIN: 'invitation:invite:admin',
      INVITE_CLINICIAN: 'invitation:invite:clinician',
      INVITE_PATIENT: 'invitation:invite:patient',
    },
    USER_VIEW: {
      OWNER: {
        FULL: 'user:owner:view:full',
        LIMITED: 'user:owner:view:limited',
        BASIC: 'user:owner:view:basic',
      },
      ADMIN: {
        FULL: 'user:admin:view:full',
        LIMITED: 'user:admin:view:limited',
        BASIC: 'user:admin:view:basic',
      },
      CLINICIAN: {
        FULL: 'user:clinician:view:full',
        LIMITED: 'user:clinician:view:limited',
        BASIC: 'user:clinician:view:basic',
      },
      PATIENT: {
        FULL: 'user:patient:view:full',
        LIMITED: 'user:patient:view:limited',
        BASIC: 'user:patient:view:basic',
      },
      CLINICIAN_PATIENT: {
        FULL: 'user:clinician-patient:view:full',
        LIMITED: 'user:clinician-patient:view:limited',
        BASIC: 'user:clinician-patient:view:basic',
      },
    },
    USER_MANAGE: {
      OWNER: 'user:owner:manage',
      ADMIN: 'user:admin:manage',
      CLINICIAN: 'user:clinician:manage',
      PATIENT: 'user:patient:manage',
      CLINICIAN_PATIENT: 'user:clinician-patient:manage',
    },
  } as const;


// Zod schema to validate permission strings
export const PermissionSchema = z.enum([
    // Invitation permissions
    PERMISSIONS.INVITATION.INVITE_OWNER,
    PERMISSIONS.INVITATION.INVITE_ADMIN,
    PERMISSIONS.INVITATION.INVITE_CLINICIAN,
    PERMISSIONS.INVITATION.INVITE_PATIENT,
    
    // Owner view permissions
    PERMISSIONS.USER_VIEW.OWNER.FULL,
    PERMISSIONS.USER_VIEW.OWNER.LIMITED,
    PERMISSIONS.USER_VIEW.OWNER.BASIC,
    
    // Admin view permissions
    PERMISSIONS.USER_VIEW.ADMIN.FULL,
    PERMISSIONS.USER_VIEW.ADMIN.LIMITED,
    PERMISSIONS.USER_VIEW.ADMIN.BASIC,
    
    // Clinician view permissions
    PERMISSIONS.USER_VIEW.CLINICIAN.FULL,
    PERMISSIONS.USER_VIEW.CLINICIAN.LIMITED,
    PERMISSIONS.USER_VIEW.CLINICIAN.BASIC,
    
    // Patient view permissions
    PERMISSIONS.USER_VIEW.PATIENT.FULL,
    PERMISSIONS.USER_VIEW.PATIENT.LIMITED,
    PERMISSIONS.USER_VIEW.PATIENT.BASIC,
    
    // Clinician-Patient view permissions (new)
    PERMISSIONS.USER_VIEW.CLINICIAN_PATIENT.FULL,
    PERMISSIONS.USER_VIEW.CLINICIAN_PATIENT.LIMITED,
    PERMISSIONS.USER_VIEW.CLINICIAN_PATIENT.BASIC,
    
    // Management permissions
    PERMISSIONS.USER_MANAGE.OWNER,
    PERMISSIONS.USER_MANAGE.ADMIN,
    PERMISSIONS.USER_MANAGE.CLINICIAN,
    PERMISSIONS.USER_MANAGE.PATIENT,
    PERMISSIONS.USER_MANAGE.CLINICIAN_PATIENT, // New
  ]);


export function validatePermission(permission: unknown) {
    const parsedResult = PermissionSchema.safeParse(permission);
    
    if (!parsedResult.success) {
      throw createZodValidationError(parsedResult.error);
    }

    return parsedResult.data;
}

export function validatePermissions(permissions: unknown) {
    const parsedResult = z.array(PermissionSchema).safeParse(permissions);
    
    if (!parsedResult.success) {
      throw createZodValidationError(parsedResult.error);
    }

    return parsedResult.data;
}