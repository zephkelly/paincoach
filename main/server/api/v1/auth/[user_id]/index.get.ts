import { z, ZodError } from 'zod';
import { getPainCoachSession } from '~~/server/utils/auth/session/getSession';

import { type MinimalUserInfo } from '~~lib/shared/types/users/minimal'
import { validateMinimalUserInfo } from '@@/shared/schemas/users/minimal';

import { DatabaseService } from '~~/server/services/databaseService';

import { onRequestValidateSession } from '~~/server/utils/auth/request-middleware/validate-session';
import { createZodValidationError } from '@@/shared/utils/zod/error';



export default defineEventHandler({
    onRequest: [
        (event) => onRequestValidateSession(event),
    ],
    handler: async (event) => {
        const {
            userSession,
            secureSession
        } = await getPainCoachSession(event);

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
            const userSecureSessionInformation: MinimalUserInfo = {
                id: secureSession.user_id,
                role: secureSession.user_role,
                email: secureSession.email,
                first_name: userSession.first_name,
                last_name: '',
                verified: secureSession.verified
            }

            return userSecureSessionInformation;
        }

        const transaction = await DatabaseService.getInstance().createTransaction();

        try {
            const userResult = await transaction.query<MinimalUserInfo>(`
                SELECT 
                    u.id,
                    u.email,
                    u.first_name,
                    u.verified,
                    r.name as role,
                FROM private.user u
                JOIN private.role r ON u.role_id = r.id
                WHERE u.id = $1
            `, [user_id]);

            if (userResult.length === 0) {
                throw createError({
                    statusCode: 404,
                    statusMessage: 'User not found'
                });
            }

            const user = validateMinimalUserInfo(userResult[0])

            setResponseStatus(event, 200);
            const fetchedUserInformation: MinimalUserInfo = {
                id: user.id,
                role: user.role,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                verified: user.verified
            }

            return fetchedUserInformation
        }
        catch (error: unknown) {
            if (import.meta.dev) {
                console.error(error);
            }

            if (error instanceof ZodError) {
                throw createZodValidationError(error);
            }

            throw createError({
                statusCode: 500,
                statusMessage: 'Internal Server Error',
            });
        }
    }
});