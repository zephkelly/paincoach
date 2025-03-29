import { ZodError } from 'zod';
import { createZodValidationError } from '@@/shared/utils/zod/error';

import { onRequestValidateSession } from '~~/server/utils/auth/request-middleware/validate-session';
import { onRequestValidateRole } from '~~/server/utils/auth/request-middleware/role-validate';
import { getPainCoachSession } from '~~/server/utils/auth/session/getSession';

import { DatabaseService } from '~~/server/services/databaseService';
import { UserService } from '~~/server/services/models/userService';

import { validateUUID } from '@@/shared/schemas/primitives';

import { type MinimalUserWithRoles } from '~~lib/shared/types/v1/user/minimal'



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

            const user = await UserService.getMinimalUserWithRolesTransaction(transaction, validatedUserId);

            if (!user) {
                throw createError({
                    statusCode: 404,
                    message: 'User not found'
                });
            }

            setResponseStatus(event, 200);
            const fetchedUserInformation: MinimalUserWithRoles = {
                public_id: user.public_id,
                primary_role: user.primary_role,
                roles: user.roles,
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