import type { DBUserInvitation } from '@@/shared/types/v1/user/invitation';
import type { H3Event } from 'h3';

import { InvitationRepository } from '~~/server/repositories/invitation';



export async function verifyInvitation(event: H3Event, token: string): Promise<DBUserInvitation> {
    if (!token) {
        throw createError({
            statusCode: 400,
            message: 'Missing token',
        });
    }

    const invitation = await InvitationRepository.getDBInvitation(event, token);

    if (!invitation) {
        throw createError({
            statusCode: 404,
            message: 'Invitation not found',
        });
    }

    if (invitation.current_status === 'revoked' || invitation.current_status === 'expired') {
        throw createError({
            statusCode: 403,
            message: 'This invitation has been revoked',
        });
    }
    
    if (new Date() > invitation.expires_at) {
        console.log('Invitation expired:', invitation.expires_at, new Date());
        await InvitationRepository.updateInvitationStatus({ token }, 'expired');
        throw createError({
            statusCode: 403,
            message: 'This invitation has expired',
        }); 
    }

    // Update invitation status to opened
    await InvitationRepository.updateInvitationStatus({ token } , 'opened');

    invitation.current_status = 'opened';
    return invitation;
}   