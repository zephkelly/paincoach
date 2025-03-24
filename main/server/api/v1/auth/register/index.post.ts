import { H3Error } from 'h3';
import { z, ZodError } from 'zod';
import { createZodValidationError } from '~~lib/shared/utils/zod/error';

import { onRequestValidateSession } from '~~/server/utils/auth/request-middleware/validate-session';

import { getPainCoachSession } from '~~/server/utils/auth/session/getSession';

import { DatabaseService } from '~~/server/services/databaseService';
import { InvitationService } from '~~/server/services/models/invitationService';

import type { UserRegister } from '@@/shared/types/users/register/index';
import { validateUserRegister } from '@@/shared/schemas/v1/user/registration';



export default defineEventHandler({
    onRequest: [
        (event) => onRequestValidateSession(event),
    ],
    handler: async (event) => {
        const {
            session,
            userSession,
            secureSession
        } = await getPainCoachSession(event);

        const body = await readBody<UserRegister>(event);
        
        const transaction = await DatabaseService.getInstance().createTransaction();

        try {
            const validatedRegisterRequest = validateUserRegister(body);

            const invitation_token = validatedRegisterRequest.invitation_token;
            const secureSessionInvitationToken = secureSession.invitation_token;

            if (invitation_token && secureSessionInvitationToken && invitation_token !== secureSessionInvitationToken) {
                throw createError({
                    statusCode: 400,
                    message: 'Invalid invitation token',
                });
            }
            

            const validatedInvitation = await InvitationService.getLimitedInvitationByTokenTransaction(invitation_token, transaction);
            
            // const allowedPrimaryProfile = validatedInvitation.primary_role;
            

            console.log('Validated registration request:', validatedRegisterRequest);
            console.log('Validated invitation:', validatedInvitation);
        }
        catch (error: unknown) {
            console.error('POST: /api/v1/auth/register:', error)
            transaction.rollback();

            if (error instanceof ZodError) {
                throw createZodValidationError(error);
            }

            if (error instanceof H3Error) {
                throw error;
            }
        }
    }
})