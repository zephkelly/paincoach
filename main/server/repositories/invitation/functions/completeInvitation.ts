import type { DBTransaction } from "~~/server/types/db";



/**
 * Complete an invitation by updating its status to 'completed',
 * removing the invitation_data, and linking it to the newly created user.
 * 
 * @param token - The invitation token
 * @param userId - The ID of the user who completed the invitation
 * @returns Promise indicating completion
 */
export async function completeInvitation(transaction: DBTransaction, token: string, userId: string): Promise<void> {
    try {
        await transaction.query(`
            UPDATE private.user_invitation
            SET 
                status = 'completed',
                invitation_data = NULL,
                linked_user_id = $1,
                updated_at = CURRENT_TIMESTAMP
            WHERE invitation_token = $2
        `, [userId, token]);
    }
    catch (error: unknown) {
        console.error('Error completing invitation:', error);
        
        if (
            typeof error === 'object' &&
            error !== null &&
            'code' in error &&
            error.code === '22P02'  // Invalid text representation
        ) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Invitation not found'
            });
        }
        
        // Check for foreign key violation (user_id doesn't exist)
        if (
            typeof error === 'object' &&
            error !== null &&
            'code' in error &&
            error.code === '23503'  // Foreign key violation
        ) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Invalid user ID'
            });
        }
        
        // Re-throw other errors
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to complete invitation'
        });
    }
}