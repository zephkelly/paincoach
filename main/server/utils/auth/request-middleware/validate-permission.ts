// server/utils/auth/request-middleware/validate-permission.ts
import { H3Event } from 'h3';
import type { SecureSessionData } from '#auth-utils';

import type { Permission } from '@@/shared/types/v1/permission';
import { getUserPermissions } from '~~/server/utils/permission/database/cached/getPermissions';

/**
 * Middleware to validate if a user has required permissions
 * 
 * @param event - H3 event object
 * @param requiredPermissions - Array of permission strings to check for
 * @param requireAll - If true, user must have all permissions. If false, user only needs one of the permissions.
 * @returns Promise<boolean> - Returns true if validation passes, throws an error otherwise
 */
export const onRequestValidatePermission = async (
  event: H3Event, 
  requiredPermissions: Permission[], 
  requireAll: boolean = false
): Promise<boolean> => {
  // Get session data
  const secureSession = (await getUserSession(event)).secure as SecureSessionData;
  
  if (!secureSession || !secureSession.user_id) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }
  
  // Get user permissions from cached function
  const userPermissions = await getUserPermissions(secureSession.user_id);
  
  // Check permissions based on requireAll flag
  const hasPermission = requireAll
    ? requiredPermissions.every(permission => userPermissions.includes(permission))
    : requiredPermissions.some(permission => userPermissions.includes(permission));
  
  if (!hasPermission) {
    throw createError({
      statusCode: 403,
      message: requireAll
        ? 'You need all required permissions to access this resource'
        : 'You need at least one of the required permissions to access this resource',
    });
  }
  
  return true;
};