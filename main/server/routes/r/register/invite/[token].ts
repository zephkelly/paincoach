import { H3Error } from "h3";
import { DatabaseService } from "~~/server/services/databaseService";

import { validateDBUserInvitation } from '@@/shared/schemas/v1/user/invitation';
import type { DBUserInvitation } from '@@/shared/types/v1/user/invitation';
import type { InvitationStatus } from "@@/shared/types/v1/user/invitation";
import { InvitationService } from "~~/server/services/invitation";


export default defineEventHandler(async (event) => {
    try {    
        const { token } = getRouterParams(event)

        if (!token || typeof token !== 'string') {
            throw createError({
                statusCode: 400,
                message: 'Invalid invitation token'
            });
        }

        const invitation = await InvitationService.verifyInvitation(event, token,);

        await clearUserSession(event);

        await replaceUserSession(event, {
            user: {
                public_id: invitation.public_user_id,
                first_name: invitation.invitation_data?.first_name || '',
                verified: false,
                primary_role: 'unregistered',
                roles: ['unregistered'],
            },
            secure: {
                //@ts-expect-error
                id: null, // Internal
                public_id: invitation.public_user_id,
                primary_role: 'unregistered',
                roles: ['unregistered'],
                email: invitation.email,
                verified: false,

                invitation_token: token,
                invitation_data: invitation.invitation_data || {},
            },
            logged_in_at: new Date(),
            verified: false,
            version: 1,
        }, {
            maxAge: 1000 * 60 * 60 * 24 * 7
        });

        return sendRedirect(event, '/dashboard/user/invite');
    }
    catch (error: unknown) {
        console.error('Error verifying invitation:', error);

        if (error instanceof H3Error) {
            throw error;
        }

        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to verify invitation'
        });
    }
});