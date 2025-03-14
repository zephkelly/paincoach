import { H3Error } from 'h3';

import { onRequestValidateSession } from '~~/server/utils/auth/request-middleware/validate-session';
import { onRequestValidateRole } from '~~/server/utils/auth/request-middleware/validate-role';
import { getPainCoachSession } from '~~/server/utils/auth/session/getSession';

import { DatabaseService } from '~~/server/services/databaseService';
import type { UserInvitation } from '@@/shared/types/users/invitation';
import { validateUserInvitation } from '@@/shared/schemas/users/invitation';



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
            isIncompleteUserRole,
            isClinicianRole
        } = await getPainCoachSession(event);

        const query = getQuery(event);

        const token = query.token as string;

        let invitation_token: string | undefined = undefined;

        if (isIncompleteUserRole) {
            invitation_token = session.secure?.invitation_token;
        }
        else {
            if (!isAdmin && !isClinicianRole) {
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
            if (isClinicianRole) {
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

            const invitation = await transaction.query<UserInvitation>(`
                SELECT 
                    ui.user_id,
                    ui.email,
                    ui.phone_number,
                    r.name as role_name,
                    ui.invitation_token,
                    u.first_name as inviter_name,
                    r2.name as inviter_role_name,
                    u.profile_url as inviter_profile_url,
                    ui.expires_at,
                    ui.registration_type,
                    ui.registration_data
                FROM private.user_invitation ui
                JOIN private.role r ON ui.role_id = r.id
                JOIN private.user u ON ui.invited_by = u.id
                JOIN private.role r2 ON u.role_id = r2.id
                WHERE ui.invitation_token = $1
                LIMIT 1
            `, [invitation_token]);

            if (invitation.length === 0 || !invitation[0]) {
                throw createError({
                    statusCode: 404,
                    message: 'Invitation not found',
                });
            }

            const validatedInvitation = validateUserInvitation(invitation[0]);

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