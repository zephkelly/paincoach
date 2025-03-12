import { type H3Event } from 'h3';
import type { IncompleteUserSession } from "#auth-utils";

export async function replaceIncompleteUserSession(event: H3Event, incompleteUserSession: IncompleteUserSession, config?: any): Promise<IncompleteUserSession> {
    await clearUserSession(event);

    //@ts-expect-error
    return replaceUserSession(event, incompleteUserSession, config) as Promise<IncompleteUserSession>;
}