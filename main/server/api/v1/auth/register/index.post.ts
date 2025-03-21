import { H3Error } from 'h3';
import { z, ZodError } from 'zod';
import { createZodValidationError } from '~~lib/shared/utils/zod/error';

import { onRequestValidateSession } from '~~/server/utils/auth/request-middleware/validate-session';

import { getPainCoachSession } from '~~/server/utils/auth/session/getSession';

import { DatabaseService } from '~~/server/services/databaseService';
import { InvitationService } from '~~/server/services/models/invitationService';

import type { UserRegister } from '@@/shared/types/users/register/index';
import { validateUserRegister } from '@@/shared/schemas/user/register';



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
            

            const validatedInvitation = await InvitationService.getInvitationByTokenTransaction(invitation_token, transaction);
            
            const allowedPrimaryProfile = validatedInvitation.role;
            const invitedEmail = validatedInvitation.email;
            const invitedPhoneNumber = validatedInvitation.phone_number;
            const allowedAdditionalProfiles = validatedInvitation.registration_data?.allowed_additional_profiles;

            const isAdminAndInvitedAsOwner = 
                validatedInvitation.inviter_role_name === 'admin' &&
                validatedInvitation.role === 'admin' &&
                //@ts-expect-error
                validatedInvitation.registration_data?.owner;

            // Ensure request is valid in the context of the invitation
            if ((validatedInvitation.role === 'admin' || validatedInvitation.role === 'clinician') && validatedInvitation.inviter_role_name !== 'admin') {
                throw createError({
                    statusCode: 400,
                    message: 'Invalid request',
                });
            }

            if (validatedInvitation.role === 'patient') {

                if (validatedInvitation.inviter_role_name === 'clinician') {

                }

                throw createError({
                    statusCode: 400,
                    message: 'Invalid request',
                });
            }

            if (allowedPrimaryProfile !== validatedRegisterRequest.role) {
                throw createError({
                    statusCode: 400,
                    message: 'Invalid request',
                });
            }

            if (invitedEmail !== validatedRegisterRequest.email || invitedPhoneNumber !== validatedRegisterRequest.phone_number) {
                throw createError({
                    statusCode: 400,
                    message: 'Invalid request',
                });
            }

            transaction.commit();


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