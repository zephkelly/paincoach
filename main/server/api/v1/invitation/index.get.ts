import { H3Error } from 'h3';

import { onRequestValidateSession } from '~~/server/utils/auth/request-middleware/validate-session';
import { onRequestValidatePermission } from '~~/server/utils/auth/request-middleware/validate-permission';

import { PERMISSIONS } from '@@/shared/schemas/v1/permission';

import { InvitationService } from '~~/server/services/invitation';



export default defineEventHandler({
    onRequest: [
        (event) => onRequestValidateSession(event),
        (event) => onRequestValidateRole(event, 'admin'),
        (event) => onRequestValidatePermission(event, [
            PERMISSIONS.INVITATION.VIEW.BASIC,
            PERMISSIONS.INVITATION.VIEW.LIMITED,
            PERMISSIONS.INVITATION.VIEW.FULL,
        ]),
    ],
    handler: async (event) => {
        const { page, items, offset,  } = getQuery(event);

        try {
            return await InvitationService.getBasicInvitations(event, {
                page: Number(page) || 1,
                items: Number(items) || 10,
                offset: Number(offset) || undefined,
            });
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

            console.error('Error getting invitations:', error);
            throw createError({
                statusCode: 500,
                message: 'Internal Server Error',
            });
        }
    }
})