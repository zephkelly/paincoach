import { z } from 'zod';
import { createZodValidationError } from '@@/shared/utils/zod/error';

// Definition of permission components
export const ResourceTypes = ['user', 'invitation', 'app'] as const;
export const ResourceSubtypes = [
    'owner', 'admin', 'clinician', 'patient', 'clinician-patient', 'app',
    'pain', 'mood', 'marriage'
] as const;
export const Actions = ['view', 'manage', 'invite', 'use'] as const;
export const ActionSubtypes = ['create', 'update', 'delete'] as const;
export const AccessLevels = ['full', 'limited', 'basic'] as const;
export const AccessLevelSubtypes = ['personal', 'team', 'org'] as const;

// Zod schema for individual components
export const ResourceTypeSchema = z.enum(ResourceTypes);
export const ResourceSubtypeSchema = z.enum(ResourceSubtypes).optional();
export const ActionSchema = z.enum(Actions);
export const ActionSubtypeSchema = z.enum(ActionSubtypes).optional();
export const AccessLevelSchema = z.enum(AccessLevels);
export const AccessLevelSubtypeSchema = z.enum(AccessLevelSubtypes).optional();

// Permission structure interface
export interface PermissionComponents {
  resourceType: z.infer<typeof ResourceTypeSchema>;
  resourceSubtype?: z.infer<typeof ResourceSubtypeSchema>;
  action: z.infer<typeof ActionSchema>;
  actionSubtype?: z.infer<typeof ActionSubtypeSchema>;
  accessLevel: z.infer<typeof AccessLevelSchema>;
  accessLevelSubtype?: z.infer<typeof AccessLevelSubtypeSchema>;
}

export type Permission = string;

// Function to build a permission string from components
export function buildPermissionString(components: PermissionComponents): Permission {
  let permString = components.resourceType;
  
  if (components.resourceSubtype) {
    permString += `:${components.resourceSubtype}`;
  }
  
  permString += `:${components.action}`;
  
  if (components.actionSubtype) {
    permString += `:${components.actionSubtype}`;
  }
  
  permString += `:${components.accessLevel}`;
  
  if (components.accessLevelSubtype) {
    permString += `:${components.accessLevelSubtype}`;
  }
  
  return permString;
}

// Function to parse a permission string into components
export function parsePermissionString(permission: Permission): PermissionComponents {
  const parts = permission.split(':');
  
  if (parts.length < 3) {
    throw new Error(`Invalid permission format: ${permission}. Minimum format is resourceType:action:accessLevel`);
  }
  
  const components: PermissionComponents = {
    resourceType: parts[0] as z.infer<typeof ResourceTypeSchema>,
    action: parts.length === 3 ? parts[1] as z.infer<typeof ActionSchema> : parts[2] as z.infer<typeof ActionSchema>,
    accessLevel: parts.length === 3 ? parts[2] as z.infer<typeof AccessLevelSchema> : parts[4] as z.infer<typeof AccessLevelSchema>,
  };
  
  if (parts.length >= 4) {
    components.resourceSubtype = parts[1] as z.infer<typeof ResourceSubtypeSchema>;
    
    if (parts.length >= 5) {
      components.actionSubtype = parts[3] as z.infer<typeof ActionSubtypeSchema>;
      
      if (parts.length >= 6) {
        components.accessLevelSubtype = parts[5] as z.infer<typeof AccessLevelSubtypeSchema>;
      }
    }
  }
  
  return components;
}

// Define permission structure as a constant object based on our new format
export const PERMISSIONS = {
  INVITATION: {
    INVITE: {
      OWNER: buildPermissionString({
        resourceType: 'invitation',
        action: 'invite',
        resourceSubtype: 'owner',
        accessLevel: 'full'
      }),
      ADMIN: buildPermissionString({
        resourceType: 'invitation',
        action: 'invite',
        resourceSubtype: 'admin',
        accessLevel: 'full'
      }),
      CLINICIAN: buildPermissionString({
        resourceType: 'invitation',
        action: 'invite',
        resourceSubtype: 'clinician',
        accessLevel: 'full'
      }),
      PATIENT: buildPermissionString({
        resourceType: 'invitation',
        action: 'invite',
        resourceSubtype: 'patient',
        accessLevel: 'full'
      }),
      APP: buildPermissionString({
        resourceType: 'invitation',
        action: 'invite',
        resourceSubtype: 'app',
        accessLevel: 'full'
      }),
    },
    VIEW: {
        ALL: buildPermissionString({
          resourceType: 'invitation',
          action: 'view',
          accessLevel: 'full'
        }),
        CLINICIAN_PATIENT: buildPermissionString({
          resourceType: 'invitation',
          action: 'view',
          resourceSubtype: 'clinician-patient', 
          accessLevel: 'limited'
        }),
        OWN: buildPermissionString({
          resourceType: 'invitation',
          action: 'view',
          accessLevel: 'limited',
          accessLevelSubtype: 'personal'
        }),
      },
  },
  USER: {
    VIEW: {
      OWNER: {
        FULL: buildPermissionString({
          resourceType: 'user',
          resourceSubtype: 'owner',
          action: 'view',
          accessLevel: 'full'
        }),
        LIMITED: buildPermissionString({
          resourceType: 'user',
          resourceSubtype: 'owner',
          action: 'view',
          accessLevel: 'limited'
        }),
        BASIC: buildPermissionString({
          resourceType: 'user',
          resourceSubtype: 'owner',
          action: 'view',
          accessLevel: 'basic'
        }),
      },
      ADMIN: {
        FULL: buildPermissionString({
          resourceType: 'user',
          resourceSubtype: 'admin',
          action: 'view',
          accessLevel: 'full'
        }),
        LIMITED: buildPermissionString({
          resourceType: 'user',
          resourceSubtype: 'admin',
          action: 'view',
          accessLevel: 'limited'
        }),
        BASIC: buildPermissionString({
          resourceType: 'user',
          resourceSubtype: 'admin',
          action: 'view',
          accessLevel: 'basic'
        }),
      },
      CLINICIAN: {
        FULL: buildPermissionString({
          resourceType: 'user',
          resourceSubtype: 'clinician',
          action: 'view',
          accessLevel: 'full'
        }),
        LIMITED: buildPermissionString({
          resourceType: 'user',
          resourceSubtype: 'clinician',
          action: 'view',
          accessLevel: 'limited'
        }),
        BASIC: buildPermissionString({
          resourceType: 'user',
          resourceSubtype: 'clinician',
          action: 'view',
          accessLevel: 'basic'
        }),
      },
      PATIENT: {
        FULL: buildPermissionString({
          resourceType: 'user',
          resourceSubtype: 'patient',
          action: 'view',
          accessLevel: 'full'
        }),
        LIMITED: buildPermissionString({
          resourceType: 'user',
          resourceSubtype: 'patient',
          action: 'view',
          accessLevel: 'limited'
        }),
        BASIC: buildPermissionString({
          resourceType: 'user',
          resourceSubtype: 'patient',
          action: 'view',
          accessLevel: 'basic'
        }),
      },
      CLINICIAN_PATIENT: {
        FULL: buildPermissionString({
          resourceType: 'user',
          resourceSubtype: 'clinician-patient',
          action: 'view',
          accessLevel: 'full'
        }),
        LIMITED: buildPermissionString({
          resourceType: 'user',
          resourceSubtype: 'clinician-patient',
          action: 'view',
          accessLevel: 'limited'
        }),
        BASIC: buildPermissionString({
          resourceType: 'user',
          resourceSubtype: 'clinician-patient',
          action: 'view',
          accessLevel: 'basic'
        }),
      },
    },
    MANAGE: {
      OWNER: buildPermissionString({
        resourceType: 'user',
        resourceSubtype: 'owner',
        action: 'manage',
        accessLevel: 'full'
      }),
      ADMIN: buildPermissionString({
        resourceType: 'user',
        resourceSubtype: 'admin',
        action: 'manage',
        accessLevel: 'full'
      }),
      CLINICIAN: buildPermissionString({
        resourceType: 'user',
        resourceSubtype: 'clinician',
        action: 'manage',
        accessLevel: 'full'
      }),
      PATIENT: buildPermissionString({
        resourceType: 'user',
        resourceSubtype: 'patient',
        action: 'manage',
        accessLevel: 'full'
      }),
      CLINICIAN_PATIENT: buildPermissionString({
        resourceType: 'user',
        resourceSubtype: 'clinician-patient',
        action: 'manage',
        accessLevel: 'full'
      }),
    },
  },
  APP: {
    USE: {
      PAIN: buildPermissionString({
        resourceType: 'app',
        resourceSubtype: 'pain',
        action: 'use',
        accessLevel: 'full'
      }),
      MOOD: buildPermissionString({
        resourceType: 'app',
        resourceSubtype: 'mood',
        action: 'use',
        accessLevel: 'full'
      }),
      MARRIAGE: buildPermissionString({
        resourceType: 'app',
        resourceSubtype: 'marriage',
        action: 'use',
        accessLevel: 'full'
      }),
    }
  }
} as const;

// Function to create a flat array of all permission strings
function flattenPermissions(obj: Record<string, any>): string[] {
  return Object.values(obj).flatMap(value =>
    typeof value === 'string' ? [value] : flattenPermissions(value)
  );
}

// Create the Zod schema by extracting all permission values
const allPermissions = flattenPermissions(PERMISSIONS);
export const PermissionSchema = z.enum(allPermissions as [string, ...string[]]);

// Permission format validator - must have at least the required components
export const PermissionFormatSchema = z.string().refine(
  (val) => {
    const parts = val.split(':');
    return parts.length >= 3; // At minimum: resourceType:action:accessLevel
  },
  {
    message: "Permission must have at least resourceType, action, and accessLevel"
  }
);

// Validation functions
export function validatePermission(permission: unknown): Permission {
  const parsedResult = PermissionSchema.safeParse(permission);
 
  if (!parsedResult.success) {
    throw createZodValidationError(parsedResult.error);
  }
  
  return parsedResult.data;
}

export function validatePermissions(permissions: unknown): Permission[] {
  const parsedResult = z.array(PermissionSchema).safeParse(permissions);
 
  if (!parsedResult.success) {
    throw createZodValidationError(parsedResult.error);
  }
  
  return parsedResult.data;
}