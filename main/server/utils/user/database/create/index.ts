import { type DBTransaction } from "~~/server/types/db";

// import { type User, type Role } from "~~lib/shared/types/users";
import { getUserById } from "../get/byId";



/**
 * Creates a new user with role-specific profile and enforces authorization rules:
 * - Only admins can create clinicians
 * - Only admins and clinicians can create patients
 * 
 * @param transaction Database transaction
 * @param userRole User role (admin, clinician, or patient)
 * @param userData User data appropriate for the specified role
 * @param creatorRole Role of the user creating this new user (optional, for auth checks)
 * @returns The created user with their role-specific data
 */
export async function createUser(
    transaction: DBTransaction,
    userRole: Role,
    userData: {
        email: string;
        password_hash: string;
        first_name: string;
        last_name?: string;
        phone_number?: string;
        [key: string]: any; // For role-specific fields
    },
    creatorRole?: Role
): Promise<User> {
    // Authorization checks
    if (userRole === 'admin' && creatorRole && creatorRole !== 'admin') {
        throw createError({
            statusCode: 403,
        });
    }

    if (userRole === 'clinician' && creatorRole && creatorRole !== 'admin') {
        throw createError({
            statusCode: 403,
            statusMessage: 'Only admins can create clinician accounts'
        });
    }

    if (userRole === 'patient' && creatorRole && creatorRole !== 'admin' && creatorRole !== 'clinician') {
        throw createError({
            statusCode: 403,
            statusMessage: 'Only admins and clinicians can create patient accounts'
        });
    }

    try {
        // 1. Insert base user and get ID in one step
        const userResult = await transaction.query<User>(`
            WITH role_id AS (
                SELECT id FROM private.role WHERE name = $1
            )
            INSERT INTO private.user (
                email, 
                password_hash, 
                first_name, 
                last_name, 
                phone_number,
                role_id,
                status
            )
            SELECT 
                $2, $3, $4, $5, $6, id, $7
            FROM role_id
            RETURNING *
        `, [
            userRole,
            userData.email,
            userData.password_hash,
            userData.first_name,
            userData.last_name || null,
            userData.phone_number || null,
            'pending'
        ]);

        if (userResult.length === 0) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to create user'
            });
        }

        const userId = userResult[0]?.id;

        if (!userId) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to create user'
            });
        }
        
        // 2. Insert role-specific profile
        switch (userRole) {
            case 'admin':
                await transaction.query(`
                    INSERT INTO private.admin_profile (user_id)
                    VALUES ($1)
                `, [userId]);
                break;
            
            case 'clinician':
                // Validation checks as before
                await transaction.query(`
                    INSERT INTO private.clinician_profile (
                        user_id, 
                        license_number, 
                        specialization, 
                        practice_name
                    )
                    VALUES ($1, $2, $3, $4)
                `, [
                    userId,
                    userData.license_number,
                    userData.specialization || null,
                    userData.practice_name || null
                ]);
                break;
            
            case 'patient':
                // Validation checks as before
                
                // Use a transaction or CTE to insert patient and relationship in one go
                if (creatorRole === 'clinician' && userData.clinician_id) {
                    await transaction.query(`
                        WITH patient_insert AS (
                            INSERT INTO private.patient_profile (
                                user_id, 
                                date_of_birth, 
                                emergency_contact_name,
                                emergency_contact_phone,
                                registration_code
                            )
                            VALUES ($1, $2, $3, $4, $5)
                            RETURNING user_id
                        )
                        INSERT INTO private.clinician_patient_relationship (
                            clinician_id,
                            patient_id,
                            status
                        )
                        SELECT $6, user_id, 'active'
                        FROM patient_insert
                    `, [
                        userId,
                        userData.date_of_birth,
                        userData.emergency_contact_name || null,
                        userData.emergency_contact_phone || null,
                        userData.registration_code,
                        userData.clinician_id
                    ]);
                } else {
                    await transaction.query(`
                        INSERT INTO private.patient_profile (
                            user_id, 
                            date_of_birth, 
                            emergency_contact_name,
                            emergency_contact_phone,
                            registration_code
                        )
                        VALUES ($1, $2, $3, $4, $5)
                    `, [
                        userId,
                        userData.date_of_birth,
                        userData.emergency_contact_name || null,
                        userData.emergency_contact_phone || null,
                        userData.registration_code
                    ]);
                }
                break;
                
            default:
                throw createError({
                    statusCode: 400,
                    statusMessage: `Invalid user role: ${userRole}`
                });
        }
        
        // 3. Use the optimized getUserById to fetch the complete user
        const user = await getUserById(transaction, userId);

        if (!user) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to create user'
            });
        }

        return user;
    }
    catch (error: any) {
        // Error handling
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.statusMessage || `Error creating user: ${error.message}`
        });
    }
}

// /**
//  * Helper function to check if a user has permission to perform an action
//  * @param transaction Database transaction
//  * @param userId User ID requesting the action
//  * @param requiredRoles Array of roles allowed to perform the action
//  * @returns True if user has permission, false otherwise
//  */
// export async function hasPermission(
//     transaction: DBTransaction,
//     userId: string,
//     requiredRoles: Role[]
// ): Promise<boolean> {
//     const result = await transaction.query<{ role: string }>(`
//         SELECT r.name as role
//         FROM private.user u
//         JOIN private.role r ON u.role_id = r.id
//         WHERE u.id = $1
//     `, [userId]);

//     if (result.length === 0) {
//         return false;
//     }

//     const userRole = result[0]?.role as Role;
//     return requiredRoles.includes(userRole);
// }