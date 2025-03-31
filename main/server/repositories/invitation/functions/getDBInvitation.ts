import type { H3Event } from 'h3';
import { DatabaseService } from "~~/server/services/databaseService";
import { invalidateNitroFunctionCache } from "~~/server/utils/cache/nitro";
import { type DBUserInvitation } from '@@/shared/types/v1/user/invitation';
import { validateDBUserInvitation } from '@@/shared/schemas/v1/user/invitation';



const FUNCTION_NAME = 'get-db-invitation-by-token';

/**
 * Cached function to get limited invitation by token
 *
 * @param event - H3 event
 * @param token - Invitation token to look up
 * @returns Promise<LimitedUserInvitation> - Limited invitation details
 */
export const getCachedDBInvitationByToken = defineCachedFunction(
  async (event: H3Event, token: string): Promise<DBUserInvitation> => {
    const db = DatabaseService.getInstance();
    
    const invitation = await db.query<DBUserInvitation>(`
        SELECT *
        FROM private.user_invitation ui
        WHERE ui.invitation_token = $1
        LIMIT 1
    `, [token]);
    
    if (invitation.length === 0 || !invitation[0]) {
        throw createError({
            statusCode: 404,
            message: 'Invitation not found',
        });
    }
    
    return validateDBUserInvitation(invitation[0]);
  },
  {
    maxAge: 3600, // Cache for 1 hour
    name: FUNCTION_NAME,
    getKey: (event: H3Event, token: string) => `db-invitation-${token}`,
    integrity: process.env.INVITATIONS_VERSION || '1',
  }
);

/**
 * Function to invalidate the cached invitation by token
 * 
 * @param token - Invitation token to invalidate in cache
 */
export async function invalidateCachedDBInvitation(token: string) {
  await invalidateNitroFunctionCache(FUNCTION_NAME, `db-invitation-${token}`);
}