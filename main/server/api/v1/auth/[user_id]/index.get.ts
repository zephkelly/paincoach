import { z } from 'zod';
import { getSession } from '~~/server/utils/auth/session/getSession';
import { BaseUserSchema } from '@@/shared/schemas/users/base';

import { type SecureSessionData, type UserSession, type User } from '#auth-utils';
import { DatabaseService } from '~~/server/services/databaseService';

import { onRequestValidateSession } from '~~/server/utils/auth/request-middleware/verify-session';
import { getUserById } from '~~/server/utils/user/database/get/byId';



const UserInformationResponseSchema = BaseUserSchema.pick({
    id: true,
    role: true,
    email: true,
    first_name: true,
    verified: true
})

export type UserInformationResponse = z.infer<typeof UserInformationResponseSchema>;

export default defineEventHandler({
    onRequest: [
        (event) => onRequestValidateSession(event),
    ],
    handler: async (event) => {
        const {
            userSession,
            secureSession
        } = await getSession(event);

        if (secureSession.user_role !== 'admin') {
            throw createError({
                statusCode: 403,
                statusMessage: 'Forbidden'
            });
        }

        const user_id = getRouterParam(event, 'user_id');
        if (!user_id) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request'
            });
        }
        else if (user_id === secureSession.user_id) {
            setResponseStatus(event, 200);
            const userSecureSessionInformation: UserInformationResponse = {
                id: secureSession.user_id,
                role: secureSession.user_role,
                email: secureSession.email,
                first_name: userSession.first_name,
                verified: secureSession.verified
            }

            return userSecureSessionInformation;
        }

        const transaction = await DatabaseService.getInstance().createTransaction();

        try {
            const user = await getUserById(
                transaction,
                user_id
            );

            setResponseStatus(event, 200);
            const fetchedUserInformation: UserInformationResponse = {
                id: user.id,
                role: user.role,
                email: user.email,
                first_name: user.first_name,
                verified: user.verified
            }

            return fetchedUserInformation
        }
        catch (error: any) {
            if (import.meta.dev) {
                console.error(error);
            }

            throw createError({
                statusCode: 500,
                statusMessage: 'Internal Server Error',
            });
        }
    }
});