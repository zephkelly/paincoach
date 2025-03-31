import { onRequestValidateSession } from "~~/server/utils/auth/request-middleware/validate-session";
import { invalidateCachedDBUserWithRolesByEmail } from "~~/server/repositories/user/functions/getDBUserByEmail";
import { getUserSessionContext } from "~~/server/utils/auth/session/getSession";

export default defineEventHandler({
    onRequest: [
        async (event) => await onRequestValidateSession(event),
    ],
    handler: async (event) => {
        const { session } = await getUserSessionContext(event);
        const clearedSession = await clearUserSession(event);

        await invalidateCachedDBUserWithRolesByEmail(session?.secure?.email as string);

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