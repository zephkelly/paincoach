import type { UserSession } from '#auth-utils';
import { type H3Event } from 'h3';



export async function onRequestAdminOrClinician(event: H3Event) {
    const session = await getUserSession(event) as UserSession;

    if (!session || !session.secure) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized'
        });
    }

    if (session.secure.user_role !== 'admin' && session.secure.user_role !== 'clinician') {
        throw createError({
            statusCode: 403,
            statusMessage: 'Forbidden'
        });
    }
}