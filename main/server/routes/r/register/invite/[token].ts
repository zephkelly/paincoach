import { H3Error } from "h3";
import { DatabaseService } from "~~/server/services/databaseService";

import { validateDBUserInvitation } from '~~lib/shared/schemas/users/invitation'



export default defineEventHandler(async (event) => {
    const { token } = getRouterParams(event)

    if (!token || typeof token !== 'string') {
        throw createError({
            statusCode: 400,
            message: 'Invalid invitation token'
        });
    }

    const db = DatabaseService.getInstance();
    
    try {
        const invitationResult = await db.query(`
            SELECT 
                i.*,
                r.name as role_name,
                CASE 
                    WHEN i.expires_at < NOW() THEN 'expired'
                    ELSE i.status 
                END AS effective_status
            FROM private.user_invitation i
            JOIN private.role r ON i.role_id = r.id
            WHERE i.invitation_token = $1
            LIMIT 1
        `, [token]);

        if (!invitationResult.length) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Invitation not found'
            });
        }

        const invitation = invitationResult[0];
        
        if (invitation.effective_status === 'expired' && invitation.status !== 'expired') {
            const transaction = await db.createTransaction();
            try {
                await transaction.query(`
                    UPDATE private.user_invitation 
                    SET status = 'expired' 
                    WHERE id = $1
                `, [invitation.id]);
                
                await transaction.commit();
                
                throw createError({
                    statusCode: 410,
                    statusMessage: 'Invitation has expired'
                });
            } catch (txError) {
                await transaction.rollback();
                throw txError;
            }
        }

        if (invitation.status === 'completed') {
            // we actually want to redirect to a looks like you've already registered page
            throw createError({
                statusCode: 409,
                statusMessage: 'Invitation has already been used'
            });
        }

        const validatedInvitation = validateDBUserInvitation(invitation);

        if (validatedInvitation.status === 'opened') {
            const incompleteSession = await getUserSession(event);

            if (!incompleteSession) {
                throw createError({
                    statusCode: 403,
                    statusMessage: 'This invitation has already been used'
                });
            }

            const typedIncompleteSession = incompleteSession as any;
            const { invitation_token } = typedIncompleteSession.secure;

            if (invitation_token !== token) {
                throw createError({
                    statusCode: 403,
                    statusMessage: 'This invitation has already been used'
                });
            }

            return sendRedirect(event, '/dashboard/user/invite');
        }

        const transaction = await db.createTransaction();
        try {
            await transaction.query(`
                UPDATE private.user_invitation 
                SET status = 'opened'
                WHERE id = $1
            `, [validatedInvitation.id]);

            const temporarySession = await replaceUserSession(event, {
                secure: {
                    user_id: validatedInvitation.user_id,
                    user_role: 'incomplete_user',
                    email: validatedInvitation.email,
                    verified: false,

                    invitation_token: token,
                },
                user: {
                    user_id: validatedInvitation.user_id,
                    first_name: validatedInvitation.registration_data?.first_name || '',
                    verified: false,
                    user_role: 'incomplete_user',

                },
                registration_data: validatedInvitation.registration_data || {},
                logged_in_at: new Date(),
                verified: false,
                version: 1,
            }, {
                maxAge: 1000 * 60 * 60 * 24 * 7
            });

            console.log('Temporary session:', temporarySession);
            
            await transaction.commit();
            return sendRedirect(event, '/dashboard/user/invite');
        }
        catch (txError) {
            await transaction.rollback();
            throw txError;
        }
    }
    catch (error: unknown) {
        if (error instanceof H3Error) {
            throw error;
        }

        console.error('Error verifying invitation:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to verify invitation'
        });
    }
});