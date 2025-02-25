import { type DBTransaction } from "~~/server/types/db";
import { type User } from "~~lib/shared/types/users";
import { getUserById } from "./byId";


/**
 * Gets a user by email with their role-specific profile data
 * @param db Database connection or transaction
 * @param email User email
 * @returns User with role-specific data or undefined if not found
 */
export async function getUser(
    db: DBTransaction,
    email: string
): Promise<User | undefined> {
    try {
        if (!email) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Email is required'
            });
        }

        // Get user ID and role
        const userResult = await db.query<{ id: string }>(`
            SELECT id
            FROM private.user
            WHERE email = $1
        `, [email]);

        if (userResult.length === 0) {
            return undefined;
        }

        const userId = userResult[0]?.id;
        
        if (!userId) {
            return undefined;
        }
        
        // Use getUserById to get complete user with role-specific data
        return await getUserById(db, userId);
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
