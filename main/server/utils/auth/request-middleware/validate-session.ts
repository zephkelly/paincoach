import type {UserSession } from '#auth-utils';
import { type H3Event } from 'h3';



export async function onRequestValidateSession(event: H3Event, allowUnregistered: boolean = false) {
    const session = await getUserSession(event) as UserSession;

    if (!session || !session.secure || !session.user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized'
        });
    }

    if (allowUnregistered) {
        if (!session.secure.user_uuid || (!session.secure.roles || session.secure.roles.length === 0) && !session.secure.invitation_token) {
            throw createError({
                statusCode: 403,
                statusMessage: 'Unauthorized'
            });
        }
    }
    else {
        if (!session.secure.verified || !session.secure.user_id || (!session.secure.roles || session.secure.roles.length === 0)) {
            throw createError({
                statusCode: 403,
                statusMessage: 'Unauthorized'
            });
        }
    }
}