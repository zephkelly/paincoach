import { type DBTransaction } from '~~/server/types/db';


/**
 * Checks if a user with the given email exists
 * @param transaction Database transaction
 * @param email User email
 * @returns Boolean indicating if the user exists
 */
export async function getUserExists(
    transaction: DBTransaction, 
    email: string
): Promise<boolean> {
    if (!email) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Email is required'
        });
    }
    
    const rows = await transaction.query<{ exists: boolean }>(`
        SELECT EXISTS (
            SELECT 1
            FROM private.user
            WHERE email = $1
        )
    `, [email]);
    
    if (rows.length === 0 || !rows[0]) {
        return false;
    }
    
    return rows[0].exists;
}