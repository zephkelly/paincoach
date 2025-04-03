import { z } from 'zod';
import { H3Event } from 'h3';
import { DatabaseService } from '~~/server/services/databaseService';



export const INVITATION_COUNT_FUNCTION_NAME = 'get-invitations-count';

export const getCachedInvitationsCount = defineCachedFunction(
    async (event: H3Event): Promise<number> => {
        const db = DatabaseService.getInstance();
        
        const countResult = await db.query(`
            SELECT COUNT(*) as total
            FROM invitation.user_invitation
        `,);

        return z.coerce.number().parse(countResult[0]?.total);
    },
    {
        maxAge: 3600, // Cache for 1 hour
        name: INVITATION_COUNT_FUNCTION_NAME,
        getKey: (event: H3Event) => `get-invitations-count-app`,
        integrity: process.env.INVITATIONS_VERSION || '1',
    }
);

/**
 * Function to invalidate the cached invitation count
 * 
 * @param event - H3 event
 */
export async function invalidateCachedInvitationsCount() {
    await invalidateNitroFunctionCache(INVITATION_COUNT_FUNCTION_NAME, `get-invitations-count-app`);
}
