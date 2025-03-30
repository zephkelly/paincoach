import type { H3Event } from 'h3';
import type { UserSession, UnregisteredUserSession } from '#auth-utils';

import type { Permission } from '@@/shared/schemas/v1/permission';
import type { CreateUserInvitationRequest } from '@@/shared/types/v1/user/invitation/create';

import { getLimitedInvitation } from './function/getInvitation';
import { createAndEmailInvitation } from './function/create/invitation';



export class InvitationService {
    public static async getLimitedInvitation(event: H3Event, token: string | undefined, session: UserSession | UnregisteredUserSession, permissions: Permission[]) {
        return await getLimitedInvitation(event, token, session, permissions);
    }

    public static async createAndEmailInvitation(
        invitationRequest: CreateUserInvitationRequest,
        session: UserSession | UnregisteredUserSession,
        permissions: Permission[],
    ) {
        return await createAndEmailInvitation(invitationRequest, session, permissions);
    }
}