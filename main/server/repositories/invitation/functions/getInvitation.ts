import { DatabaseService } from "~~/server/services/databaseService";
import { type LimitedUserInvitation } from "@@/shared/types/v1/user/invitation/minimal";
import { validateLimitedUserInvitation } from "@@/shared/schemas/v1/user/invitation/limited";



export async function getLimitedInvitationByToken(token: string): Promise<LimitedUserInvitation> {
    const db = DatabaseService.getInstance();
    const invitation = await db.query<LimitedUserInvitation>(`
        SELECT 
            ui.public_user_id,
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
        JOIN private.user u ON ui.invited_by_user_id = u.id
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