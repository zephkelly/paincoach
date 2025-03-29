import { onRequestValidateSession } from '~~/server/utils/auth/request-middleware/validate-session';
import { onRequestRejectRole } from '~~/server/utils/auth/request-middleware/role-reject';

import { PERMISSIONS } from '@@/shared/schemas/v1/permission';

import { getPainCoachSession } from '~~/server/utils/auth/session/getSession';

import type { CreateUserInvitationRequest } from '@@/shared/types/v1/user/invitation/create';

import { InvitationService } from '~~/server/services/invitation';



export default defineEventHandler({
    onRequest: [
        (event) => onRequestValidateSession(event),
        (event) => onRequestRejectRole(event, 'unregistered'),
        (event) => onRequestValidatePermission(event, [
            PERMISSIONS.INVITATION.INVITE.OWNER,
            PERMISSIONS.INVITATION.INVITE.ADMIN,
            PERMISSIONS.INVITATION.INVITE.CLINICIAN,
            PERMISSIONS.INVITATION.INVITE.PATIENT,
            PERMISSIONS.INVITATION.INVITE.APP
        ])
    ],
    handler: async (event) => {
        const {
            session,
            permissions
        } = await getPainCoachSession(event);

        const body = await readBody<CreateUserInvitationRequest>(event);

        await InvitationService.createInvitation(
            body,
            session,
            permissions,
        );

        // const transaction = await DatabaseService.getInstance().createTransaction();

        // try {
        //     const validatedData = validateCreateUserInvitationRequest(body);

        //     if (validatedData.email !== validatedData.confirm_email) {
        //         throw createError({
        //             statusCode: 400,
        //             message: 'Emails do not match',
        //         });
        //     }

        //     const desiredRole = validatedData.primary_role;

        //     if (desiredRole === 'patient') {
        //         return createPatientInvitation(transaction, validatedData, secureSession);
        //     }
        //     else if (desiredRole === 'clinician') {
        //         // return createClinicianInvitation(validatedData, secureSession);
        //         return {
        //             message: 'Not implemented yet',
        //         }
        //     }
        //     else if (desiredRole === 'admin') {
        //         return createAdminInvitation(event, transaction, validatedData);
        //     }
        // }
        // catch (error: unknown) {
        //     await transaction.rollback();
        //     console.log('Rolling back transaction due to error', error);

        //     if (error instanceof H3Error) {
        //         throw error;
        //     }

        //     throw createError({
        //         statusCode: 500,
        //         message: 'Internal server error',
        //     });
        // }
    }
})