import type { H3Event } from 'h3';
import type { UserSession, UnregisteredUserSession } from '#auth-utils';

import type { PaginationParams } from '@@/shared/types/pagination';

import type { Permission } from '@@/shared/schemas/v1/permission';
import type { CreateUserInvitationRequest } from '@@/shared/types/v1/user/invitation/create';

import { InvitationRepository } from '~~/server/repositories/invitation';

import { getLimitedInvitation } from './function/getLimitedInvitation';
import { createInvitation } from './function/create/invitation';
import { verifyInvitation } from './function/verifyInvitation';

import { sendInvitationEmail } from './function/create/email';


export class InvitationService {
    public static async getInvitation(event: H3Event, token: string | undefined, session: UserSession | UnregisteredUserSession, permissions: Permission[]) {
        return await getLimitedInvitation(event, token, session, permissions);
    }

    public static async getLimitedInvitation(event: H3Event, token: string | undefined, session: UserSession | UnregisteredUserSession, permissions: Permission[]) {
        return await getLimitedInvitation(event, token, session, permissions);
    }

    public static async getBasicInvitations(event: H3Event, paginationParams: PaginationParams) {
        return await InvitationRepository.getBasicInvitations(event, paginationParams);
    }


    public static async createInvitation(
        invitationRequest: CreateUserInvitationRequest,
        session: UserSession | UnregisteredUserSession,
        permissions: Permission[],
    ) {
        try {
            return await createInvitation(invitationRequest, session, permissions);
        }
        catch(error: unknown) {
            if (error instanceof Error) {
                throw createError({
                    statusCode: 500,
                    message: error.message,
                });
            }

            throw createError({
                statusCode: 500,
                message: 'Unknown error occurred while creating invitation',
            });
        }
    }

    public static async emailInvitation(
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