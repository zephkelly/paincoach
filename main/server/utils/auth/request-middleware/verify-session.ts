import type { IncompleteUserSession, UserSession } from '#auth-utils';
import { type H3Event } from 'h3';


export async function onRequestValidateSession(event: H3Event) {
    const session = await getUserSession(event) as UserSession;

    if (!session || !session.secure) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized'
        });
    }
}


export async function onRequestValidateUserSession(event: H3Event) {
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
}

export async function onRequestValidateIncompleteUserSession(event: H3Event) {
    const session = await getUserSession(event) as any as IncompleteUserSession;

    if (!session || !session.secure || !session.registration_data) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized'
        });
    }

    if (!session.secure.invitation_token) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Unauthorized'
        });
    }
}