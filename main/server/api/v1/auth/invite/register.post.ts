import { H3Error } from 'h3';
import { onRequestValidateSession } from '~~/server/utils/auth/request-middleware/validate-session';
import { onRequestRejectRole } from '~~/server/utils/auth/request-middleware/role-reject';

import { PERMISSIONS } from '@@/shared/schemas/v1/permission';

import { getPainCoachSession } from '~~/server/utils/auth/session/getSession';


import { InvitationService } from '~~/server/services/invitation';
import type { UserRegister } from '@@/shared/types/v1/user/registration';
import { validateUserRegister } from '@@/shared/schemas/v1/user/registration';



export default defineEventHandler({
    onRequest: [
        (event) => onRequestValidateSession(event),
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
                permissions
            } = await getPainCoachSession(event);
    
            const body = await readBody<UserRegister>(event);

            const validatedUserRegistrationRequest = validateUserRegister(body);

            
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