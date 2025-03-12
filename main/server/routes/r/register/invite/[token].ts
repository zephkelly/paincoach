import { H3Error } from "h3";
import { DatabaseService } from "~~/server/services/databaseService";

import { type UserInvitation } from "~~lib/shared/types/users/invitation";
import { validateUserInvitation } from '~~lib/shared/schemas/users/invitation'

import { replaceIncompleteUserSession } from "~~/server/utils/auth/session/replace";



export default defineEventHandler(async (event) => {
    const { token } = getRouterParams(event)

    if (!token || typeof token !== 'string') {
        throw createError({
            statusCode: 400,
            message: 'Invalid invitation token'
        });
    }

    const transaction = await DatabaseService.getInstance().createTransaction();

    try {
        // Look up the invitation
        const invitationResult = await transaction.query<UserInvitation & { role_name: string }>(`
            SELECT * FROM private.user_invitation
            WHERE invitation_token = $1
            LIMIT 1
        `, [token]);

        if (!invitationResult.length) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Invitation not found'
            });
        }

        const invitation = invitationResult[0];

        if (!invitation) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Invitation not found'
            });
        }

        const validatedInvitation = validateUserInvitation(invitation);

        // Check if the invitation is expired
        if (new Date() > validatedInvitation.expires_at) {
            // Update the invitation status to expired
            await transaction.query(`
                UPDATE private.user_invitation 
                SET status = 'expired' 
                WHERE id = $1
            `, [validatedInvitation.id]);

            throw createError({
                statusCode: 410,
                statusMessage: 'Invitation has expired'
            });
        }

        // Check if the invitation has already been used
        if (validatedInvitation.status === 'completed') {
            throw createError({
                statusCode: 409,
                statusMessage: 'Invitation has already been used'
            });
        }

        // Redirect to registration completion page based on role
        const temporarySession = await replaceIncompleteUserSession(event, {
            registration_data: validatedInvitation.registration_data || {},
            logged_in_at: new Date()
        }, {
            maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
        });

        console.log(temporarySession)

        const registrationRoute = getRegistrationRoute(invitation.role_name);

        transaction.commit();
        return sendRedirect(event, registrationRoute);
    }
    catch (error: unknown) {
        transaction.rollback();

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

// Helper function to determine the registration route based on role
function getRegistrationRoute(role: string): string {
    switch (role) {
        case 'admin':
            return '/auth/complete-admin-registration';
        case 'clinician':
            return '/auth/complete-clinician-registration';
        case 'patient':
            return '/auth/complete-patient-registration';
        default:
            return '/auth/complete-registration';
    }
}