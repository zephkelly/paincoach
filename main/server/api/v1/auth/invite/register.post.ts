import { H3Error } from 'h3';
import { onRequestValidateSession } from '~~/server/utils/auth/request-middleware/validate-session';
import { getPainCoachSession } from '~~/server/utils/auth/session/getSession';

import { PERMISSIONS } from '@@/shared/schemas/v1/permission';

import type { UnregisteredUserSession } from '#auth-utils';
import { UserService } from '~~/server/services/user';

import type { UserRegister } from '@@/shared/types/v1/user/registration';
import { userRegisterStrictValidator } from '@@/shared/schemas/v1/user/registration';



export default defineEventHandler({
    onRequest: [
        (event) => onRequestValidateSession(event, true),
        (event) => onRequestValidatePermission(event, {
            invitation: [
                PERMISSIONS.INVITATION.VIEW.OWN.BASIC,
            ]
        }),
    ],
    handler: async (event) => {
        try {
            const {
                session,
            } = await getPainCoachSession(event);

            const typedSession = session as UnregisteredUserSession;
    
            const body = await readBody<UserRegister>(event);

            const validatedUserRegistrationRequest = userRegisterStrictValidator.validate(body);

            await UserService.registerInviteUser(event, validatedUserRegistrationRequest, typedSession);

            await clearUserSession(event);
            
            setResponseStatus(event, 201);
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