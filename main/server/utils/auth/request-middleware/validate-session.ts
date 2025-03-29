import type { H3Event } from 'h3';

import { getUserSessionContext } from '~~/server/utils/auth/session/getSession';
import { validateRegisteredSessionObjectSchema, validateUnregisterdSessionObjectSchema } from '@@/shared/schemas/v1/session';


export async function onRequestValidateSession(event: H3Event, allowUnregistered: boolean = false) {
    const { session } = await getUserSessionContext(event);

    if (!session) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized'
        });
    }

    // Deep validate the session object
    try {
        if (allowUnregistered) {
            if (session.secure?.verified) {
                validateRegisteredSessionObjectSchema(session);
            }
            else {
                validateUnregisterdSessionObjectSchema(session);
            }
        }
        else {
            validateRegisteredSessionObjectSchema(session);
        }
    }
    catch (error) {
        console.error('Session validation error:', error);

        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid session data'
        });
    }
}