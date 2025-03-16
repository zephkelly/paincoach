import { type DBTransaction } from "~~/server/types/db";
import { type User, type DBUser } from "~~lib/shared/types/users";

/**
 * Gets a user by email with their role-specific profile data
 * @param db Database connection or transaction
 * @param email User email
 * @returns User with role-specific data or undefined if not found
 */
export async function getUser(
    db: DBTransaction,
    email: string,
): Promise<User | undefined> {

    try {
        if (!email) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Email is required'
            });
        }

        // Get user ID and role
        const userResult = await db.query<User>(`
            SELECT 
                u.*,
                r.name as role
            FROM private.user u
            JOIN private.role r ON u.role_id = r.id
            WHERE email = $1
        `, [email]);

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

/**
 * Gets a user by email with their role-specific profile data
 * @param db Database connection or transaction
 * @param email User email
 * @returns User with role-specific data or undefined if not found
 */
export async function getDBUser(
    db: DBTransaction,
    email: string,
): Promise<DBUser | undefined> {
    try {
        if (!email) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Email is required'
            });
        }
        
        const query = `
            WITH user_data AS (
                SELECT
                    u.*,
                    r.name as role
                FROM private.user u
                JOIN private.role r ON u.role_id = r.id
                WHERE email = $1
            ),
            admin_profiles AS (
                SELECT
                    ap.user_id,
                    ap.owner,
                    jsonb_build_object(
                        'user_id', ap.user_id,
                        'created_at', ap.created_at
                    ) as profile_data
                FROM private.admin_profile ap
                JOIN user_data ud ON ap.user_id = ud.id
                WHERE ud.role = 'admin'
            ),
            clinician_profiles AS (
                SELECT
                    cp.user_id,
                    jsonb_build_object(
                        'user_id', cp.user_id,
                        'ahprah_registration_number', cp.ahprah_registration_number,
                        'specialisation', cp.specialisation,
                        'practice_name', cp.practice_name,
                        'created_at', cp.created_at
                    ) as profile_data
                FROM private.clinician_profile cp
                JOIN user_data ud ON cp.user_id = ud.id
                WHERE ud.role = 'clinician'
            ),
            patient_profiles AS (
                SELECT
                    pp.user_id,
                    jsonb_build_object(
                        'user_id', pp.user_id,
                        'created_at', pp.created_at
                    ) as profile_data
                FROM private.patient_profile pp
                JOIN user_data ud ON pp.user_id = ud.id
                WHERE ud.role = 'patient'
            )
            SELECT
                ud.*,
                CASE WHEN ud.role = 'admin' THEN ap.owner ELSE null END as owner,
                COALESCE(
                    ap.profile_data,
                    cp.profile_data,
                    pp.profile_data,
                    'null'::jsonb
                ) as profile
            FROM user_data ud
            LEFT JOIN admin_profiles ap ON ud.id = ap.user_id AND ud.role = 'admin'
            LEFT JOIN clinician_profiles cp ON ud.id = cp.user_id AND ud.role = 'clinician'
            LEFT JOIN patient_profiles pp ON ud.id = pp.user_id AND ud.role = 'patient'
        `;

        const result = await db.query<DBUser>(query, [email]);
        
        if (result.length === 0) {
            return undefined;
        }
        
        return result[0];
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