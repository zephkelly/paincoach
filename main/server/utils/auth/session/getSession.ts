import { H3Event } from 'h3'
import type { UserSession, SecureSessionData, User } from '#auth-utils';

export async function getSession(event: H3Event) {
    const session = await getUserSession(event) as UserSession;
    const secureSession = session.secure as SecureSessionData;
    const userSession = session.user as User;

    return {
        session,
        secureSession,
        userSession,
    }
}