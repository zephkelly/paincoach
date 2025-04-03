import { H3Error } from 'h3';
import { onRequestValidateSession } from '~~/server/utils/auth/request-middleware/validate-session';
import { onRequestRejectRole } from '~~/server/utils/auth/request-middleware/role-reject';

import { PERMISSIONS } from '@@/shared/schemas/v1/permission';

import { getPainCoachSession } from '~~/server/utils/auth/session/getSession';

import type { CreateUserInvitationRequest } from '@@/shared/types/v1/user/invitation/create';

import { InvitationService } from '~~/server/services/invitation';
import { validateCreateUserInvitationRequest } from '@@/shared/schemas/v1/user/invitation/create';



export default defineEventHandler({
    onRequest: [
        (event) => onRequestValidateSession(event),
        (event) => onRequestRejectRole(event, 'unregistered'),
        (event) => onRequestValidatePermission(event, [
            PERMISSIONS.INVITATION.INVITE.OWNER,
            PERMISSIONS.INVITATION.INVITE.ADMIN,
            PERMISSIONS.INVITATION.INVITE.CLINICIAN,
            PERMISSIONS.INVITATION.INVITE.PATIENT,
            PERMISSIONS.INVITATION.INVITE.APP
        ])
    ],
    handler: async (event) => {
        try {
            const {
                session,
                permissions
            } = await getPainCoachSession(event);
    
            const unvalidatedInvitation = await readBody<CreateUserInvitationRequest>(event);
            const validatedInvitationRequest = validateCreateUserInvitationRequest(unvalidatedInvitation);
    
            const { token } = await InvitationService.createInvitation(
                validatedInvitationRequest,
                session,
                permissions,
            );

            await InvitationService.sendInvitation(
                validatedInvitationRequest,
                token,
                session,
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

            console.error('Error creating invitation:', error);
            throw createError({
                statusCode: 500,
                message: 'Internal Server Error',
            });
        }
    }
})