import type { UserSession, UnregisteredUserSession } from '#auth-utils';
import { PERMISSIONS, type Permission } from '@@/shared/schemas/v1/permission';

import { UUID7 } from '@@/shared/utils/uuid';
import type { CreateUserInvitationRequest } from '@@/shared/types/v1/user/invitation/create';

import { sendInvitationEmail } from './email';
import { InvitationRepository } from '~~/server/repositories/invitation';



export async function createAndEmailInvitation(
    invitationRequest: CreateUserInvitationRequest,
    session: UserSession | UnregisteredUserSession,
    permissions: Permission[],
) {
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

    const invitationToken = UUID7();

    await InvitationRepository.createInvitation(
        invitationToken,
        invitationRequest.email,
        invitationRequest.phone_number || undefined,
        invitationRequest.primary_role,
        invitationRequest.roles,
        invitationRequest.invitation_data,
        invitingUserId,
    );

    try {
        const inviterName = typedSession.user?.first_name || 'Pain Coach Admin';
        
        await sendInvitationEmail(
            invitationRequest.email,
            invitationToken,
            inviterName,
            desiredRoles,
            invitationRequest.primary_role,
            typedSession.user?.profile_url
        );
        
        console.log(`Invitation email sent successfully to ${invitationRequest.email}`);
    }
    catch (error: unknown) {
        console.error('Error sending invitation email:', error);
    }
}