import type { H3Event } from 'h3';
import type { UserSession, UnregisteredUserSession } from '#auth-utils';

import type { Permission } from '@@/shared/schemas/v1/permission';
import type { CreateUserInvitationRequest } from '@@/shared/types/v1/user/invitation/create';

import { getLimitedInvitation } from './function/getLimitedInvitation';
import { createInvitationInDB } from './function/create/invitation';
import { verifyInvitation } from './function/getInvitation';

import { sendInvitationEmail } from './function/create/email';


export class InvitationService {
    public static async getLimitedInvitation(event: H3Event, token: string | undefined, session: UserSession | UnregisteredUserSession, permissions: Permission[]) {
        return await getLimitedInvitation(event, token, session, permissions);
    }

    public static async getInvitation(event: H3Event, token: string | undefined, session: UserSession | UnregisteredUserSession, permissions: Permission[]) {
        return await getLimitedInvitation(event, token, session, permissions);
    }

    public static async createInvitation(
        invitationRequest: CreateUserInvitationRequest,
        session: UserSession | UnregisteredUserSession,
        permissions: Permission[],
    ) {
        return await createInvitationInDB(invitationRequest, session, permissions);
    }

    public static async sendInvitation(
        invitationRequest: CreateUserInvitationRequest,
        token: string,
        session: UserSession | UnregisteredUserSession,
    ) {
        return await sendInvitationEmail(
            invitationRequest.email,
            token,
            invitationRequest.roles,
            invitationRequest.primary_role,
            session.user?.first_name || 'Pain Coach Admin',
        );
    }

    public static async verifyInvitation(event: H3Event, token: string) {
        return await verifyInvitation(event, token);
    }
}