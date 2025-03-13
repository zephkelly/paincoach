import { type DBTransaction } from "~~/server/types/db";
import { type User } from "~~lib/shared/types/users";

/**
 * Gets a user by email with their role-specific profile data
 * @param db Database connection or transaction
 * @param email User email
 * @returns User with role-specific data or undefined if not found
 */
export async function getUserById(
    db: DBTransaction,
    id: string,
): Promise<User | undefined> {

    try {
        if (!id) {
            throw createError({
                statusCode: 400,
                statusMessage: 'ID is required'
            });
        }

        // Get user ID and role
        const userResult = await db.query<User>(`
            SELECT 
                u.*,
                r.name as role
            FROM private.user u
            JOIN private.role r ON u.role_id = r.id
            WHERE id = $1
        `, [id]);

        if (userResult.length === 0) {
            return undefined;
        }

        return userResult[0]
    }
    catch (error: any) {
        if (error.statusCode) {
            throw error; // Re-throw HTTP errors
        }

        throw createError({
            statusCode: 500,
            statusMessage: `Error getting user: ${error.message}`
        });
    }
}
