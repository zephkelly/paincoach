import type { H3Event } from 'h3';

import { getUserSessionContext } from '~~/server/utils/auth/session/getSession';
import { validateRegisteredSessionObjectSchema, validateUnregisterdSessionObjectSchema } from '@@/shared/schemas/v1/session';
import { ZodError } from 'zod';


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
    catch (error: unknown) {
        if (error instanceof ZodError) {
            console.error('Session validation error:', error.format());
        }
        else {
            console.error('Session validation error:', error);
        }

        sendRedirect(event, '/dashboard/login', 401);
    }
}