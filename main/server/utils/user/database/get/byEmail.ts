import { H3Error } from "h3";
import { type DBTransaction } from "~~/server/types/db";

import type { Role } from "@@/shared/types/v1/role";

import type { DBUserWithRoles } from "@@/shared/types/v1/user";
import { validateDBUserWithRoles } from "@@/shared/schemas/v1/user";

import type { MinimalUserWithRoles } from "@@/shared/types/v1/user/minimal";
import { validateMinimalUserWithRoles } from "@@/shared/schemas/v1/user/minimal";


// import type {
//     BaseUser,
//     BaseUserWithRoles,
//     BaseUserWithRolesPartial
// } from "@@/shared/types/users/base";

// import { validateBaseUser, validateBaseUserWithRoles } from "@@/shared/schemas/user/base";

// import { type User, type DBUser } from "~~lib/shared/types/users";

// import { type MinimalRole } from "@@/shared/types/users/role/minimal";
// import { validateMinimalRoles } from "@@/shared/schemas/user/role/minimal";
// import { validateDBUser } from "@@/shared/schemas/user";


/**
 * Gets a user by email with their roles and role-specific profile data
 * @param db Database connection or transaction
 * @param email User email
 * @returns User with role information or undefined if not found
 */
export async function getMinimalUserWithRoles(
    db: DBTransaction,
    email: string,
): Promise<MinimalUserWithRoles | undefined> {
    try {
        if (!email) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Email is required'
            });
        }

        // Get basic user data
        const userResult = await db.query<MinimalUserWithRoles>(`
            SELECT
                u.uuid,
                u.email,
                u.profile_url,
                u.first_name,
                u.last_name,
                u.status,
                u.created_at,
                u.primary_role,
                COALESCE(
                    (SELECT array_agg(role_name ORDER BY (role_name = u.primary_role) DESC)
                     FROM (
                        SELECT DISTINCT r.name as role_name
                        FROM private.user_role ur2
                        JOIN private.role r ON ur2.role_id = r.id
                        WHERE ur2.user_id = u.id
                     ) AS distinct_roles),
                    ARRAY[]::text[]
                ) AS roles
            FROM private.user u
            WHERE u.email = $1
            `, [email]);
       
        if (userResult.length === 0) {
            return undefined;
        }
       
        // Filter out null values from roles array (in case user has no roles)
        return validateMinimalUserWithRoles(userResult[0]);
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
 * Gets a user by email with their roles and role-specific profile data
 * @param db Database connection or transaction
 * @param email User email
 * @returns User with role information or undefined if not found
 */
export async function getDBUserWithRoles(
    db: DBTransaction,
    email: string,
): Promise<DBUserWithRoles | undefined> {
    try {
        if (!email) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Email is required'
            });
        }

        // Get basic user data
        const userResult = await db.query<DBUserWithRoles>(`
            SELECT
                u.*,
                COALESCE(
                    (SELECT array_agg(role_name ORDER BY (role_name = u.primary_role) DESC)
                     FROM (
                        SELECT DISTINCT r.name as role_name
                        FROM private.user_role ur2
                        JOIN private.role r ON ur2.role_id = r.id
                        WHERE ur2.user_id = u.id
                     ) AS distinct_roles),
                    ARRAY[]::text[]
                ) AS roles
            FROM private.user u
            WHERE u.email = $1
            `, [email]);
       
        if (userResult.length === 0) {
            return undefined;
        }
       
        // Filter out null values from roles array (in case user has no roles)
        return validateDBUserWithRoles(userResult[0]);
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

// /**
//  * Gets a user by email with their roles and role-specific profile data
//  * @param db Database connection or transaction
//  * @param email User email
//  * @returns User with role-specific data or undefined if not found
//  */
// export async function getDBUserWithRoles(
//     db: DBTransaction,
//     email: string,
// ): Promise<DBUser | undefined> {
//     try {
//         if (!email) {
//             throw createError({
//                 statusCode: 400,
//                 statusMessage: 'Email is required'
//             });
//         }
        
//         const query = `
//             WITH user_data AS (
//                 SELECT
//                     u.*
//                 FROM private.user u
//                 WHERE email = $1
//             ),
//             user_roles AS (
//                 SELECT
//                     ur.user_id,
//                     r.name as role,
//                     ur.is_primary
//                 FROM private.user_role ur
//                 JOIN private.role r ON ur.role_id = r.id
//                 JOIN user_data ud ON ur.user_id = ud.id
//             ),
//             admin_profiles AS (
//                 SELECT
//                     ap.user_id,
//                     ap.owner,
//                     jsonb_build_object(
//                         'role', 'admin',
//                         'user_id', ap.user_id,
//                         'owner', ap.owner,
//                         'created_at', ap.created_at,
//                         'updated_at', ap.updated_at
//                     ) as profile_data
//                 FROM private.admin_profile ap
//                 JOIN user_data ud ON ap.user_id = ud.id
//                 JOIN user_roles ur ON ur.user_id = ud.id AND ur.role = 'admin'
//             ),
//             clinician_profiles AS (
//                 SELECT
//                     cp.user_id,
//                     jsonb_build_object(
//                         'role', 'clinician',
//                         'user_id', cp.user_id,
//                         'ahprah_registration_number', cp.ahprah_registration_number,
//                         'specialisation', cp.specialisation,
//                         'practice_name', cp.practice_name,
//                         'abn', cp.abn,
//                         'created_at', cp.created_at,
//                         'updated_at', cp.updated_at
//                     ) as profile_data
//                 FROM private.clinician_profile cp
//                 JOIN user_data ud ON cp.user_id = ud.id
//                 JOIN user_roles ur ON ur.user_id = ud.id AND ur.role = 'clinician'
//             ),
//             patient_profiles AS (
//                 SELECT
//                     pp.user_id,
//                     jsonb_build_object(
//                         'role', 'patient',
//                         'user_id', pp.user_id,
//                         'created_at', pp.created_at,
//                         'updated_at', pp.updated_at
//                     ) as profile_data
//                 FROM private.patient_profile pp
//                 JOIN user_data ud ON pp.user_id = ud.id
//                 JOIN user_roles ur ON ur.user_id = ud.id AND ur.role = 'patient'
//             ),
//             combined_profiles AS (
//                 SELECT 
//                     user_id,
//                     profile_data
//                 FROM admin_profiles
//                 UNION ALL
//                 SELECT 
//                     user_id,
//                     profile_data
//                 FROM clinician_profiles
//                 UNION ALL
//                 SELECT 
//                     user_id,
//                     profile_data
//                 FROM patient_profiles
//             )
//             SELECT
//                 ud.*,
//                 (
//                     SELECT jsonb_agg(ur.role)
//                     FROM user_roles ur
//                     WHERE ur.user_id = ud.id
//                 ) as roles,
//                 (
//                     SELECT ur.role
//                     FROM user_roles ur
//                     WHERE ur.user_id = ud.id AND ur.is_primary
//                     LIMIT 1
//                 ) as primary_role,
//                 (
//                     SELECT jsonb_agg(cp.profile_data)
//                     FROM combined_profiles cp
//                     WHERE cp.user_id = ud.id
//                 ) as profiles,
//                 (
//                     SELECT ap.owner
//                     FROM admin_profiles ap
//                     WHERE ap.user_id = ud.id
//                     LIMIT 1
//                 ) as owner
//             FROM user_data ud
//         `;

//         const result = await db.query<any>(query, [email]);
        
//         if (result.length === 0) {
//             return undefined;
//         }
        
//         const user = validateDBUser(result[0]);
        
//         // Handle the case where no roles were found
//         if (!user.roles || user.roles.length === 0) {
//             throw createError({
//                 statusCode: 400,
//                 statusMessage: 'User has no roles assigned'
//             });
//         }
        
//         // Handle the case where no primary role was found
//         if (!user.primary_role) {
//             throw createError({
//                 statusCode: 400,
//                 statusMessage: 'User has no primary role assigned'
//             });
//         }
        
//         return user;
//     }
//     catch (error: unknown) {
//         if (error instanceof H3Error) {
//             throw error;
//         }

//         throw createError({
//             statusCode: 500,
//         });
//     }
// }