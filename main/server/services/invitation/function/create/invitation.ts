import type { UserSession, UnregisteredUserSession } from '#auth-utils';
import { PERMISSIONS, type Permission } from '@@/shared/schemas/v1/permission';

import { uuidv7 } from '@@/shared/utils/uuid';
import { validateUUID } from '@@/shared/schemas/primitives';
import type { CreateUserInvitationRequest } from '@@/shared/types/v1/user/invitation/create';

import { InvitationRepository } from '~~/server/repositories/invitation';
import { DatabaseService } from '~~/server/services/databaseService';



export async function createInvitation(
    invitationRequest: CreateUserInvitationRequest,
    session: UserSession | UnregisteredUserSession,
    permissions: Permission[],
): Promise<{ token: string }> {
    const typedSession = session as UserSession;

    const desiredRoles = invitationRequest.roles;

    const invitingUserId = typedSession.secure?.id;

    if (!invitingUserId) {
        throw createError({
            statusCode: 403,
            statusMessage: 'User ID not found in session'
        });
    }

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

    const invitationToken = uuidv7();

    const transaction = await DatabaseService.getInstance().createTransaction();

    try {
        const { invitation_id } = await InvitationRepository.createInvitation(transaction,
            invitationToken,
            invitationRequest.email,
            invitationRequest.phone_number || undefined,
            invitationRequest.primary_role,
            invitationRequest.roles,
            invitationRequest.invitation_data,
            invitingUserId,
        );

        const validatedInvitationId = validateUUID(invitation_id);
    
        await InvitationRepository.updateInvitationStatus(
            { token: invitationToken, invitation_id: validatedInvitationId },
            'pending',
            invitingUserId,
            transaction,
        );

        transaction.commit();
    
        return { token: invitationToken }
    }
    catch (error: unknown) {
        transaction.rollback();

        if (error instanceof Error) {
            throw createError({
                statusCode: 500,
                statusMessage: error.message,
            });
        }
        else {
            throw createError({
                statusCode: 500,
                statusMessage: 'Unknown error occurred while creating invitation'
            });
        }
    }
}