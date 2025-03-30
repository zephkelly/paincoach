import { H3Error } from 'h3';

import { onRequestValidateSession } from '~~/server/utils/auth/request-middleware/validate-session';
import { onRequestValidatePermission } from '~~/server/utils/auth/request-middleware/validate-permission';

import { PERMISSIONS } from '@@/shared/schemas/v1/permission';

import { InvitationService } from '~~/server/services/invitation';



export default defineEventHandler({
    onRequest: [
        (event) => onRequestValidateSession(event, true),
        (event) => onRequestValidatePermission(event, [
            PERMISSIONS.INVITATION.VIEW.BASIC,
            PERMISSIONS.INVITATION.VIEW.LIMITED,
            PERMISSIONS.INVITATION.VIEW.FULL,

            PERMISSIONS.INVITATION.VIEW.OWN.BASIC,
            PERMISSIONS.INVITATION.VIEW.OWN.LIMITED,
            PERMISSIONS.INVITATION.VIEW.OWN.FULL,

            PERMISSIONS.INVITATION.VIEW.CLINICIAN_PATIENT,
        ]),
    ],
    handler: async (event) => {
        const {
            session,
            permissions
        } = await getPainCoachSession(event);

        try {
            let token: string | undefined = getQuery(event).token as string | undefined;

            return await InvitationService.getLimitedInvitation(event,
                token,
                session,
                permissions
            );
        }
        catch (error: unknown) {
            if (error instanceof H3Error) {
                throw error;
            }
            
            if (error instanceof Error) {
                throw createError({
                    statusCode: 500,
                    message: error.message,
                });
            }

            console.error('Error getting invitation:', error);
            throw createError({
                statusCode: 500,
                message: 'Internal Server Error',
            });
        }
    }
})