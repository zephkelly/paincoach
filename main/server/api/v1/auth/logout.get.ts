import { onRequestValidateSession } from "~~/server/utils/auth/request-middleware/validate-session";



export default defineEventHandler({
    onRequest: [
        (event) => onRequestValidateSession(event),
    ],
    handler: async (event) => {
        const clearedSession = await clearUserSession(event);

        if (!clearedSession) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request'
            });
        }

        return {
            message: 'Logged out successfully'
        };
    }
});