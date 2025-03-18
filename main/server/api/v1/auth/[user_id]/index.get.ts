import { z, ZodError } from 'zod';
import { createZodValidationError } from '@@/shared/utils/zod/error';

import { onRequestValidateSession } from '~~/server/utils/auth/request-middleware/validate-session';
import { onRequestValidateRole } from '~~/server/utils/auth/request-middleware/validate-role';
import { getPainCoachSession } from '~~/server/utils/auth/session/getSession';

import { DatabaseService } from '~~/server/services/databaseService';

import { validateUUID } from '@@/shared/schemas/primitives';
import { validateUserStatus } from '@@/shared/schemas/user/base';
import { validateBaseDBMinimalUser } from '@@/shared/schemas/user/minimal';

import { type BaseDBMininmalUser } from '~~lib/shared/types/users/minimal'



export default defineEventHandler({
    onRequest: [
        (event) => onRequestValidateSession(event),
        (event) => onRequestValidateRole(event, ['admin'])
    ],
    handler: async (event) => {
        const {
            userSession,
            secureSession
        } = await getPainCoachSession(event);

        const transaction = await DatabaseService.getInstance().createTransaction()

        try {
            const user_id = getRouterParam(event, 'user_id');
        
            if (!user_id) {
                throw createError({
                    statusCode: 400,
                    statusMessage: 'Bad Request'
                });
            }

            const validatedUserId = validateUUID(user_id);

            if (validatedUserId === secureSession.user_id) {
                const requestingUsersAdditionalInfo = await transaction.query<{
                    last_name: string | null,
                    status: string,
                    created_at: Date
                }>(`
                    SELECT 
                        u.last_name,
                        u.status,
                        u.created_at,
                    FROM private.user u
                    WHERE u.id = $1
                `, [validatedUserId]);

                if (requestingUsersAdditionalInfo.length === 0 || !requestingUsersAdditionalInfo[0]) {
                    throw createError({
                        statusCode: 404,
                        statusMessage: 'User not found'
                    });
                }
                
                const userSecureSessionInformation: BaseDBMininmalUser = {
                    id: secureSession.user_id,
                    role: secureSession.user_role,
                    email: secureSession.email,
                    first_name: userSession.first_name,
                    profile_url: userSession.profile_url,
                    last_name: requestingUsersAdditionalInfo[0].last_name,
                    status: validateUserStatus(requestingUsersAdditionalInfo[0].status),
                    created_at: new Date(requestingUsersAdditionalInfo[0].created_at)
                }

                return userSecureSessionInformation;
            }

            const userResult = await transaction.query<BaseDBMininmalUser>(`
                SELECT 
                    u.id,
                    u.email,
                    u.first_name,
                    u.last_name,
                    u.profile_url,
                    u.status,
                    u.created_at,
                    r.name as role,
                FROM private.user u
                JOIN private.role r ON u.role_id = r.id
                WHERE u.id = $1
            `, [validatedUserId]);

            if (userResult.length === 0 || !userResult[0]) {
                throw createError({
                    statusCode: 404,
                    statusMessage: 'User not found'
                });
            }

            const user = validateBaseDBMinimalUser(userResult[0])

            setResponseStatus(event, 200);
            const fetchedUserInformation: BaseDBMininmalUser = {
                id: user.id,
                role: user.role,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                profile_url: user.profile_url,
                status: user.status,
                created_at: user.created_at
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