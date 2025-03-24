import { DatabaseService } from "../databaseService";
import type { DBTransaction } from "~~/server/types/db";

import type { MinimalUserInvitation } from "@@/shared/types/v1/user/invitation/minimal";

import { validateLimitedUserInvitation } from "@@/shared/schemas/v1/user/invitation/limited";



export class InvitationService {
    public static async getLimitedInvitationByTokenTransaction(token: string, transaction: DBTransaction): Promise<MinimalUserInvitation> {
        const invitation = await transaction.query<MinimalUserInvitation>(`
            SELECT 
                ui.user_uuid,
                ui.email,
                ui.phone_number,
                ui.primary_role,
                ui.roles,
                ui.invitation_token,
                u.first_name as inviter_name,
                u.profile_url as inviter_profile_url,
                ui.expires_at,
                ui.invitation_data
            FROM private.user_invitation ui
            JOIN private.user u ON ui.invited_by = u.id
            WHERE ui.invitation_token = $1
            LIMIT 1
        `, [token]);

        if (invitation.length === 0 || !invitation[0]) {
            throw createError({
                statusCode: 404,
                message: 'Invitation not found',
            });
        }

        return validateLimitedUserInvitation(invitation[0]);
    }
}