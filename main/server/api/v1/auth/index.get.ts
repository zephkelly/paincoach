import { type UserSession } from '#auth-utils';

export default defineEventHandler(async (event) => {
    await onRequestValidateSession(event, true);
});