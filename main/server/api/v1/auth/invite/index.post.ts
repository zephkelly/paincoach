import { H3Error } from 'h3';

import { onRequestValidateSession } from '~~/server/utils/auth/request-middleware/validate-session';
import { onRequestValidateRole } from '~~/server/utils/auth/request-middleware/validate-role';

import { getPainCoachSession } from '~~/server/utils/auth/session/getSession';

import { type InviteUserRequest } from '@@/shared/types/users/invitation/request';
import { validateInviteUserRequest } from '@@/shared/schemas/user/invitation/request';

import { DatabaseService } from '~~/server/services/databaseService';
import { createPatientInvitation } from '~~/server/utils/auth/handlers/invite/patient';
import { createAdminInvitation } from '~~/server/utils/auth/handlers/invite/admin';



export default defineEventHandler({
    onRequest: [
        (event) => onRequestValidateSession(event),
        (event) => onRequestValidateRole(event, ['clinician', 'admin']),
    ],
    handler: async (event) => {
        const {
            userSession,
            secureSession
        } = await getPainCoachSession(event);

        const body = await readBody<InviteUserRequest>(event);

        const transaction = await DatabaseService.getInstance().createTransaction();

        try {
            const validatedData = validateInviteUserRequest(body);

            const desiredRole = validatedData.user.role;

            if (desiredRole === 'patient') {
                return createPatientInvitation(transaction, validatedData, secureSession);
            }
            else if (desiredRole === 'clinician') {
                // return createClinicianInvitation(validatedData, secureSession);
                return {
                    message: 'Not implemented yet',
                }
            }
            else if (desiredRole === 'admin') {
                return createAdminInvitation(transaction, validatedData, secureSession, userSession);
            }
        }
        catch (error: unknown) {
            await transaction.rollback();

            if (error instanceof H3Error) {
                throw error;
            }

            throw createError({
                statusCode: 500,
                message: 'Internal server error',
            });
        }
    }
})