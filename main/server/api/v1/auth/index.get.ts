import { type UserSession } from '#auth-utils';

export default defineEventHandler(async (event) => {
    const session = await getUserSession(event) as UserSession;

    if (!session || !session.secure || !session.user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized'
        });
    }

    if (!session.secure.verified || !session.secure.user_id || !session.secure.user_role) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Unauthorized'
        });
    }

    setResponseStatus(event, 200);
    return {
        user_id: session.secure.user_id,
        role: session.secure.user_role,
        verified: session.secure.verified,
    }
});