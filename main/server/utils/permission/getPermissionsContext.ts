import type { H3Event } from 'h3';

import type { Permission } from '@@/shared/types/v1/permission';
import { PermissionRepository } from '~~/server/repositories/permission';
import { PERMISSIONS } from '@@/shared/schemas/v1/permission';
import { create } from 'domain';



export async  function getPermissionsContext(event: H3Event, userId: string | null): Promise<Permission[]> {
    let userPermissions: Permission[] = [];

    // These should always be dealt with by the getSessionContext middleware
    if (!event.context.paincoach) {
        throw createError({
            statusCode: 500,
            message: 'Malformed context',
        });
    }

    if (!event.context.paincoach.user) {
        throw createError({
            statusCode: 500,
            message: 'Malformed context',
        });
    }

    // Ensure the permissions array is initialised
    if (!event.context.paincoach.user.permissions) {
        event.context.paincoach.user.permissions = [];
    }

    if (!event.context.paincoach || 
        !event.context.paincoach.user ||
        event.context.paincoach.user.permissions.length === 0
    ) {
        if (userId === null) {
            // We are an unregistered user, we only provide permission to view their own invitation
            // in order to complete registration, this is a special case for the invitation endpoint
            userPermissions = [
                PERMISSIONS.INVITATION.VIEW.OWN,
            ];
        }
        else {
            userPermissions = await PermissionRepository.getPermissions(event, userId);
        }

        event.context.paincoach.user.permissions = userPermissions;
    }
    else {
        userPermissions = event.context.paincoach.user.permissions;
    }

    return userPermissions;
}