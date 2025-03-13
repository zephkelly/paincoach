import { H3Error } from "h3";
import { DatabaseService } from "~~/server/services/databaseService";

import { validateUserInvitation } from '~~lib/shared/schemas/users/invitation'

import { replaceIncompleteUserSession } from "~~/server/utils/auth/session/replace";
// import type { IncompleteUserSession } from "#auth-utils";



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

        const validatedInvitation = validateUserInvitation(invitation);

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

            const temporarySession = await replaceIncompleteUserSession(event, {
                secure: {
                    //@ts-expect-error
                    invitation_token: token
                },
                user: {
                    //@ts-expect-error
                    registration_data: validatedInvitation.registration_data || {}
                },
                logged_in_at: new Date()
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