import type { H3Event } from 'h3';
import { DatabaseService } from "~~/server/services/databaseService";
import { invalidateNitroFunctionCache } from "~~/server/utils/cache/nitro";
import { type LimitedUserInvitation } from "@@/shared/types/v1/user/invitation/limited";
import { LimitedUserInvitationValidator } from '@@/shared/schemas/v1/user/invitation/limited';

const FUNCTION_NAME = 'get-basic-invitation';



/**
 * Cached function to get limited invitation by token
 *
 * @param event - H3 event
 * @param token - Invitation token to look up
 * @returns Promise<LimitedUserInvitation> - Limited invitation details
 */
export const getCachedBasicInvitation = defineCachedFunction(
    async (event: H3Event, token: string): Promise<LimitedUserInvitation> => {
        const db = DatabaseService.getInstance();
        
        const invitation = await db.query<LimitedUserInvitation>(`
            SELECT
                ui.public_user_id,
                ui.email,
                ui.primary_role,
                ui.roles,
                ui.invitation_token,
                ui.expires_at,
                ui.current_status,
                u.first_name as inviter_name,
                u.profile_url as inviter_profile_url,
                linked_user.public_id as linked_user_public_id
            FROM invitation.user_invitation_with_status ui
            JOIN private.user u ON ui.invited_by_user_id = u.id
            LEFT JOIN private.user linked_user ON ui.linked_user_id = linked_user.id
            WHERE ui.invitation_token = $1
            LIMIT 1
        `, [token]);
        
        if (invitation.length === 0 || !invitation[0]) {
            throw createError({
                statusCode: 404,
                message: 'Invitation not found',
            });
        }
        
        return LimitedUserInvitationValidator.validate(invitation[0]);
    },
    {
        maxAge: 3600, // Cache for 1 hour
        name: FUNCTION_NAME,
        getKey: (event: H3Event, token: string) => `get-basic-invitations-app`,
        integrity: process.env.INVITATIONS_VERSION || '1',
    }
);



/**
 * Function to invalidate the cached invitation by token
 * 
 * @param token - Invitation token to invalidate in cache
 */
export async function invalidateCachedBasicInvitation(token: string) {
  await invalidateNitroFunctionCache(FUNCTION_NAME, `basic-invitation-${token}`);
}