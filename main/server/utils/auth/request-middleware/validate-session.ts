import type { H3Event } from 'h3';

import { getUserSessionContext } from '~~/server/utils/auth/session/getSession';
import { registeredSessionObjectValidator, unregisterdSessionObjectValidator } from '@@/shared/schemas/v1/session';


export async function onRequestValidateSession(event: H3Event, allowUnregistered: boolean = false) {
    const { session } = await getUserSessionContext(event);

    if (!session || !session.secure || !session.user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized'
        });
    }

    // Deep validate the session object
    try {
        if (allowUnregistered) {
            if (session.secure?.verified) {
                registeredSessionObjectValidator.validate(session);
            }
            else {
                unregisterdSessionObjectValidator.validate(session);
            }
        }
        else {
            registeredSessionObjectValidator.validate(session);
        }
    }
    catch (error: unknown) {
        console.log('Session validation failed:', error);
        sendRedirect(event, '/dashboard/login', 401);
    }
}