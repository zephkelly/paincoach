import { type H3Event } from 'h3';
import type { IncompleteUserSession } from "#auth-utils";

export function setIncompleteUserSession(event: H3Event, incompleteUserSession: IncompleteUserSession, config?: any): Promise<IncompleteUserSession> {
    //@ts-expect-error
    return setUserSession(event, incompleteUserSession, config) as Promise<IncompleteUserSession>;
}