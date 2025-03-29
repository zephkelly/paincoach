import { H3Error } from 'h3';

import { onRequestValidateSession } from '~~/server/utils/auth/request-middleware/validate-session';
import { onRequestValidatePermission } from '~~/server/utils/auth/request-middleware/validate-permission';

import { PERMISSIONS } from '@@/shared/schemas/v1/permission';

import { InvitationService } from '~~/server/services/invitation';



export default defineEventHandler({
    onRequest: [
        (event) => onRequestValidateSession(event, true),
        (event) => onRequestValidatePermission(event, [
            PERMISSIONS.INVITATION.VIEW.OWN,
            PERMISSIONS.INVITATION.VIEW.ALL,
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

            return await InvitationService.getInvitation(token, session, permissions);
        }
        catch (error: unknown) {
            if (error instanceof H3Error) {
                throw error;
            }
            else {
                console.error('Error fetching invitation:', error);
                throw createError({
                    statusCode: 500,
                    message: 'Internal Server Error',
                });
            }
        }
    }
})