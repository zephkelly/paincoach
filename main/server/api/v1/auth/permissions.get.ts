import { H3Error } from 'h3';
import { onRequestValidateSession } from "~~/server/utils/auth/request-middleware/validate-session";
import { PermissionRepository } from "~~/server/repositories/permission";

export default defineEventHandler({
    onRequest: [
        async (event) => await onRequestValidateSession(event),
    ],
    handler: async (event) => {
        try {
            const { secureSession } = await getPainCoachSession(event);
            
            if (!secureSession || !secureSession.id) {
                throw createError({
                    statusCode: 401,
                    message: 'Unauthorized',
                });
            }

            const permissions = await PermissionRepository.getPermissions(event, secureSession.id);
            
            return permissions;
        }
        catch (error: unknown) {
            if (error instanceof H3Error) {
                throw error;
            }

            console.error('Error getting permissions', error);
            throw createError({
                statusCode: 500,
                message: 'Internal Server Error',
            });
        }
    }
});