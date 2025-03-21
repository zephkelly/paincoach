import type { MinimalUserInvitation, UserInvitation } from "@@/shared/types/users/invitation";
import { DatabaseService } from "../databaseService";
import { validateMinimalUserInvitation, validateUserInvitation } from "@@/shared/schemas/user/invitation";
import type { DBTransaction } from "~~/server/types/db";


export class InvitationService {
    public static async getMinimalInvitationByToken(token: string): Promise<MinimalUserInvitation> {
        const invitation = await DatabaseService.getInstance().query<MinimalUserInvitation>(`
            SELECT 
                ui.user_id,
                ui.email,
                ui.phone_number,
                r.name as role,
                ui.invitation_token,
                u.first_name as inviter_name,
                r2.name as inviter_role_name,
                u.profile_url as inviter_profile_url,
                ui.expires_at,
                ui.registration_type,
                ui.registration_data
            FROM private.user_invitation ui
            JOIN private.role r ON ui.role_id = r.id
            JOIN private.user u ON ui.invited_by = u.id
            JOIN private.role r2 ON u.role_id = r2.id
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
                ui.user_id,
                ui.email,
                ui.phone_number,
                r.name as role,
                ui.invitation_token,
                u.first_name as inviter_name,
                r2.name as inviter_role_name,
                u.profile_url as inviter_profile_url,
                ui.expires_at,
                ui.registration_type,
                ui.registration_data
            FROM private.user_invitation ui
            JOIN private.role r ON ui.role_id = r.id
            JOIN private.user u ON ui.invited_by = u.id
            JOIN private.role r2 ON u.role_id = r2.id
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

    public static async getInvitationByTokenTransaction(token: string, transaction: DBTransaction): Promise<UserInvitation> {
        const invitation = await transaction.query<UserInvitation>(`
            SELECT 
                ui.*,
                r.name as role,
                r2.name as inviter_role_name
            FROM private.user_invitation ui
            JOIN private.role r ON ui.role_id = r.id
            JOIN private.user u ON ui.invited_by = u.id
            JOIN private.role r2 ON u.role_id = r2.id
            WHERE ui.invitation_token = $1
            LIMIT 1
        `, [token]);

        if (invitation.length === 0 || !invitation[0]) {
            throw createError({
                statusCode: 404,
                message: 'Invitation not found',
            });
        }

        return validateUserInvitation(invitation[0]);
    }
}