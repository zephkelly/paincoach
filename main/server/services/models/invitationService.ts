import { DatabaseService } from "../databaseService";
import type { DBTransaction } from "~~/server/types/db";

import type { MinimalUserInvitation } from "@@/shared/types/v1/user/invitation/minimal";

import { validateMinimalUserInvitation } from "@@/shared/schemas/v1/user/invitation/minimal";



export class InvitationService {
    public static async getMinimalInvitationByToken(token: string): Promise<MinimalUserInvitation> {
        const invitation = await DatabaseService.getInstance().query<MinimalUserInvitation>(`
            SELECT 
                ui.user_uuid,
                ui.email,
                ui.phone_number,
                ui.primary_role,
                ui.roles,
                ui.invitation_token,
                u.first_name as inviter_name,
                r.name as inviter_role_name,
                u.profile_url as inviter_profile_url,
                ui.expires_at,
                ui.registration_type,
                ui.registration_data
            FROM private.user_invitation ui
            JOIN private.user u ON ui.invited_by = u.id
            JOIN private.role r ON u.role_id = r.id
            WHERE ui.invitation_token = $1
            LIMIT 1
        `, [token]);

        if (invitation.length === 0 || !invitation[0]) {
            throw createError({
                statusCode: 404,
                message: 'Invitation not found',
            });
        }

        return validateMinimalUserInvitation(invitation[0]);
    }

    public static async getMinimalInvitationByTokenTransaction(token: string, transaction: DBTransaction): Promise<MinimalUserInvitation> {
        const invitation = await transaction.query<MinimalUserInvitation>(`
            SELECT 
                ui.user_uuid,
                ui.email,
                ui.phone_number,
                ui.primary_role,
                ui.roles,
                ui.invitation_token,
                u.first_name as inviter_name,
                r.name as inviter_role_name,
                u.profile_url as inviter_profile_url,
                ui.expires_at,
                ui.registration_type,
                ui.registration_data
            FROM private.user_invitation ui
            JOIN private.user u ON ui.invited_by = u.id
            JOIN private.role r ON u.role_id = r.id
            WHERE ui.invitation_token = $1
            LIMIT 1
        `, [token]);

        if (invitation.length === 0 || !invitation[0]) {
            throw createError({
                statusCode: 404,
                message: 'Invitation not found',
            });
        }

        return validateMinimalUserInvitation(invitation[0]);
    }
}