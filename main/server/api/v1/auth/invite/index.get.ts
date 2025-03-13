import { H3Error } from 'h3';

import { onRequestValidateSession } from '~~/server/utils/auth/request-middleware/verify-session';
import { getPainCoachSession } from '~~/server/utils/auth/session/getSession';

import { DatabaseService } from '~~/server/services/databaseService';
import type { UserInvitation } from '@@/shared/types/users/invitation';
import { validateUserInvitation } from '@@/shared/schemas/users/invitation';



export default defineEventHandler({
    onRequest: [
        (event) => onRequestValidateSession(event),
    ],
    handler: async (event) => {
        const {
            session,
        } = await getPainCoachSession(event);

        const query = getQuery(event);

        const token = query.token as string;

        let invitation_token: string | undefined = undefined;

        if (session.user?.user_id !== undefined) {
            if (session.secure?.user_role !== 'admin') {
                throw createError({
                    statusCode: 403,
                    message: 'Only invited users can access invitations'
                });
            }

            invitation_token = token;
        }   
        else {
            //@ts-expect-error
            invitation_token = session.secure?.invitation_token;
        }
                
        if (!invitation_token) {
            throw createError({
                statusCode: 400,
                message: 'Invalid request',
            });
        }

        const transaction = await DatabaseService.getInstance().createTransaction();

        try {
            const invitation = await transaction.query<UserInvitation>(`
                SELECT ui.*, r.role_name 
                FROM private.user_invitation ui
                JOIN private.role r ON ui.role_id = r.id
                WHERE ui.invitation_token = $1
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

            throw createError({
                statusCode: 500,
                message: 'Internal server error',
            });
        }
    }
})