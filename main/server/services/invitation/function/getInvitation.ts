import type { UnregisteredUserSession, UserSession } from '#auth-utils';

import type { Permission } from '@@/shared/types/v1/permission';
import { InvitationRepository } from '~~/server/repositories/invitation';
import { hasPermission } from '~~/server/utils/permission/hasPermission';



export async function getInvitation(token: string, session: UserSession | UnregisteredUserSession, permissions: Permission[]) {
    if (hasPermission(permissions, 'invitation:view:full')) {
        return await InvitationRepository.getLimitedInvitation(token);
    }

    if (hasPermission(permissions, 'invitation:view:limited:personal')) {
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
        
        return await InvitationRepository.getLimitedInvitation(token);
    }

    if (hasPermission(permissions, 'invitation:view:limited:clinician-patient')) {
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
        
        return await InvitationRepository.getLimitedInvitation(token);
    }

    throw createError({
        statusCode: 403,
        message: 'You are not authorised to view this invitation',
    });
}