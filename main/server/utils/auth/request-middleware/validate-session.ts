import type {UserSession } from '#auth-utils';
import { type H3Event } from 'h3';



export async function onRequestValidateSession(event: H3Event) {
    const session = await getUserSession(event) as UserSession;

    if (!session || !session.secure || !session.user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized'
        });
    }

    if ((!session.secure.verified || !session.secure.user_id || !session.secure.user_role) && !session.secure.invitation_token) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Unauthorized'
        });
    }
}