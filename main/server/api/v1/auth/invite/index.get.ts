import { H3Error } from 'h3';

import { onRequestValidateSession } from '~~/server/utils/auth/request-middleware/validate-session';
import { onRequestValidateRole } from '~~/server/utils/auth/request-middleware/validate-role';
import { getPainCoachSession } from '~~/server/utils/auth/session/getSession';

import { DatabaseService } from '~~/server/services/databaseService';
import type { MinimalUserInvitation } from '@@/shared/types/users/invitation/index';
import { validateMinimalUserInvitation } from '@@/shared/schemas/user/invitation';
import { InvitationService } from '~~/server/services/models/invitationService';



export default defineEventHandler({
    onRequest: [
        (event) => onRequestValidateSession(event),
        (event) => onRequestValidateRole(event, ['incomplete_user', 'clinician']),
    ],
    handler: async (event) => {
        const {
            session,
            user_id: requestingUserId,

            isAdmin,
            isIncompleteUser,
            isClinician
        } = await getPainCoachSession(event);

        const query = getQuery(event);

        const token = query.token as string;

        let invitation_token: string | undefined = undefined;

        if (isIncompleteUser) {
            invitation_token = session.secure?.invitation_token;
        }
        else {
            if (!isAdmin && !isClinician) {
                throw createError({
                    statusCode: 403,
                    message: 'Only invited users and invitees can access invitations'
                });
            }

            invitation_token = token;
        }

        if (!invitation_token) {
            throw createError({
                statusCode: 400,
                message: 'Invalid request',
            });
        }

        const transaction = await DatabaseService.getInstance().createTransaction();

        try {
            if (isClinician) {
                const clinicianInvitation = await transaction.query<{ exists: boolean }>(`
                    SELECT EXISTS (
                        SELECT 1 FROM private.user_invitation WHERE invitation_token = $1 AND invited_by = $2
                    )
                `, [invitation_token, requestingUserId]);

                if (!clinicianInvitation[0] || !clinicianInvitation[0].exists) {
                    await transaction.rollback();

                    throw createError({
                        statusCode: 403,
                        message: 'You are not authorised to view this invitation',
                    });
                }
            }

            const validatedInvitation = await InvitationService.getMinimalInvitationByTokenTransaction(invitation_token, transaction);

            transaction.commit();

            return validatedInvitation;
        }
        catch (error: unknown) {
            await transaction.rollback();

            if (error instanceof H3Error) {
                throw error;
            }

            console.error('GET: /api/v1/auth/invite:', error);

            throw createError({
                statusCode: 500,
                message: 'Internal server error',
            });
        }
    }
})