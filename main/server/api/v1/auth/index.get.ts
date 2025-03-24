import { type UserSession } from '#auth-utils';

export default defineEventHandler(async (event) => {
    const session = await getUserSession(event);

    console.log(session);

    if (!session || !session.secure || !session.user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorised'
        });
    }

    if (!session.secure.verified || !session.secure.user_id || !session.secure.primary_role) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Unauthorized'
        });
    }

});