import type { H3Event } from 'h3';
import type { UnregisteredUserSession, UserSession } from '#auth-utils';

import { PERMISSIONS } from '@@/shared/schemas/v1/permission';
import type { Permission } from '@@/shared/types/v1/permission';
import { InvitationRepository } from '~~/server/repositories/invitation';
import { hasPermission } from '~~/server/utils/permission/hasPermission';



export async function getLimitedInvitation(event: H3Event, token: string | undefined, session: UserSession | UnregisteredUserSession, permissions: Permission[]) {
    const suppliedToken = !token;
    const isUnregisteredUser = !token && !session.secure?.id;
    
    if (!token) {
        //@ts-expect-error
        token = session.secure?.invitation_token;

        if (!token) {
            throw createError({
                statusCode: 400,
                message: 'Missing token',
            });
        }
    }
    
    
    if (suppliedToken) {
        // We have admin access
        if (hasPermission(permissions, PERMISSIONS.INVITATION.VIEW.FULL)) {
            return await InvitationRepository.getLimitedInvitation(event, token);
        }

        // We are clinician trying to view a patient invitation
        if (hasPermission(permissions, [
            PERMISSIONS.INVITATION.VIEW.CLINICIAN_PATIENT
        ])) {
            const clinician_id = session.secure?.id;
            if (!clinician_id) {
                throw createError({
                    statusCode: 403,
                    message: 'You are not authorised to view this invitation',
                });
            }
            const isInvitedByClinician = await InvitationRepository.verifyInvitedByClinician(clinician_id, token);
            if (!isInvitedByClinician) {
                throw createError({
                    statusCode: 403,
                    message: 'You are not authorised to view this invitation',
                });
            }
            
            return await InvitationRepository.getLimitedInvitation(event, token);
        }
    }
    
    // We are an unregistered user trying to view our own invitation
    if (isUnregisteredUser && hasPermission(permissions, [
        PERMISSIONS.INVITATION.VIEW.OWN.BASIC,
    ])) {
        const invited_user_id = session.secure?.public_id;
        if (!invited_user_id) {
            throw createError({
                statusCode: 403,
                message: 'You are not authorised to view this invitation',
            });
        }

        const isInvitedUser = await InvitationRepository.verifyInvitedUser(invited_user_id, token);
        if (!isInvitedUser) {
            throw createError({
                statusCode: 403,
                message: 'You are not authorised to view this invitation',
            });
        }
        
        return await InvitationRepository.getLimitedInvitation(event, token);
    }

    throw createError({
        statusCode: 403,
        message: 'You are not authorised to view this invitation',
    });
}