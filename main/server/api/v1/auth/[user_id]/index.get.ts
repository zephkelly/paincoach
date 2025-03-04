import { type SecureSessionData, type UserSession, type User } from '#auth-utils';
import { DatabaseService } from '~~/server/services/databaseService';

import { eventValidateSession } from '~~/server/utils/auth/middlewares/verify-session';
import { getUserById } from '~~/server/utils/user/database/get/byId';



export default defineEventHandler({
    onRequest: [
        (event) => eventValidateSession(event),
    ],
    handler: async (event) => {
        const session = await getUserSession(event) as UserSession;
        const secureSession = session.secure as SecureSessionData;
        const userSession = session.user as User;

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
            return {
                user_id: secureSession.user_id,
                user_role: secureSession.user_role,
                email: userSession.email,
                name: userSession.name,
                verified: secureSession.verified
            }
        }

        const transaction = await DatabaseService.getInstance().createTransaction();

        try {
            const user = await getUserById(
                transaction,
                user_id
            );

            if (!user) {
                throw createError({
                    statusCode: 404,
                    statusMessage: 'Not Found'
                });
            }

            setResponseStatus(event, 200);
            return {
                user_id: user_id,
                user_role: user.role,
                email: user.email,
                name: user.first_name,
                verified: user.verified
            }
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