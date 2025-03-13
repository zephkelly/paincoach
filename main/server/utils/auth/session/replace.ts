import type { UserSession } from '#auth-utils';
import { type H3Event } from 'h3';

export async function replaceIncompleteUserSession(event: H3Event, incompleteUserSession: UserSession, config?: any): Promise<UserSession> {
    return replaceUserSession(event, incompleteUserSession, config) as Promise<UserSession>;
}