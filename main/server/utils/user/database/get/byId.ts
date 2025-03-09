import { type DBTransaction } from '~~/server/types/db'

import { type User, type UserRole } from '~~lib/shared/types/users'
import { type AdminUser } from "~~lib/shared/types/users/admin";
import { type ClinicianUser } from "~~lib/shared/types/users/clinician";
import { type PatientUser } from "~~lib/shared/types/users/patient";

import { validateUser } from "~~lib/shared/schemas/users";


/**
 * Retrieves a user by ID with their role-specific profile data
 * @param db Database connection or transaction
 * @param userId User ID
 * @returns User with role-specific data or undefined if not found
 */
export async function getUserById(
    db: DBTransaction,
    userId: string
): Promise<User> {
    // Single query with conditional JOINs
    const userResult = await db.query(`
        SELECT 
            u.*,
            r.name as role,
            -- Admin fields (none)
            -- Clinician fields
            cp.ahprah_registration_number,
            cp.specialisation,
            cp.practice_name
        FROM private.user u
        JOIN private.role r ON u.role_id = r.id
        LEFT JOIN private.admin_profile ap ON u.id = ap.user_id AND r.name = 'admin'
        LEFT JOIN private.clinician_profile cp ON u.id = cp.user_id AND r.name = 'clinician'
        LEFT JOIN private.patient_profile pp ON u.id = pp.user_id AND r.name = 'patient'
        WHERE u.id = $1
    `, [userId]);

    if (userResult.length === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: 'User not found'
        });
    }

    const userData = userResult[0];
    const userRole = userData?.role as UserRole;

    // Construct the appropriate user object based on role
    let fullUser: User;
    switch (userRole) {
        case 'admin':
            fullUser = {
                ...userData,
                role: 'admin'
            } as AdminUser;
            break;

        case 'clinician':
            fullUser = {
                ...userData,
                role: 'clinician'
            } as ClinicianUser;
            break;

        case 'patient':
            fullUser = {
                ...userData,
                role: 'patient'
            } as PatientUser;
            break;

        default:
            throw createError({
                statusCode: 500,
                statusMessage: `Invalid user role: ${userRole}`
            });
    }

    return validateUser(fullUser);
}