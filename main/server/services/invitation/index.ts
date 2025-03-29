import type { UserSession, UnregisteredUserSession } from '#auth-utils';

import { PERMISSIONS, type Permission } from '@@/shared/schemas/v1/permission';

import { getInvitation } from './function/getInvitation';



import { DatabaseService } from '~~/server/services/databaseService';
import type { CreateUserInvitationRequest } from '@@/shared/types/v1/user/invitation/create';

export class InvitationService {
    public static async getInvitation(token: string, session: UserSession | UnregisteredUserSession, permissions: Permission[]) {
        return await getInvitation(token, session, permissions);
    }

    public static async createInvitation(
        invitationData: CreateUserInvitationRequest,
        session: UserSession | UnregisteredUserSession,
        permissions: Permission[],
    ) {
        const desiredRoles = invitationData.roles;
        const primaryRole = invitationData.primary_role;

        const roleToPermissionMap = {
            'admin': PERMISSIONS.INVITATION.INVITE.ADMIN,
            'clinician': PERMISSIONS.INVITATION.INVITE.CLINICIAN,
            'patient': PERMISSIONS.INVITATION.INVITE.PATIENT,
            'owner': PERMISSIONS.INVITATION.INVITE.OWNER,
            'app': PERMISSIONS.INVITATION.INVITE.APP,
        };
        
        // Create array of required permissions based on desired roles
        const requiredPermissions = desiredRoles.map(role => {
            const permission = roleToPermissionMap[role];
            if (!permission) {
                throw createError({
                    statusCode: 400,
                    statusMessage: `Invalid role: ${role}`
                });
            }
            return permission;
        });
        
        // Check if user has all required permissions
        if (!hasPermission(permissions, requiredPermissions, true)) {
            throw createError({
                statusCode: 403,
                statusMessage: 'You do not have permission to assign one or more of these roles'
            });
        }
        

        const transaction = await DatabaseService.getInstance().createTransaction();

        console.log('Trying to create invitation:', invitationData);
    }

}