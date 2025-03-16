import { type DBTransaction } from "~~/server/types/db";
import { type PaginationParams } from "@@/shared/types/api";
import { type DBMinimalUser } from "@@/shared/types/users/minimal";



export async function getAllUsers(db: DBTransaction, paginationParams: PaginationParams): Promise<DBMinimalUser[]> {
    let roles = paginationParams.roles || [];

    if (!roles.length) {
        return []
    }

    if (roles.length === 1 && roles[0] === 'all') {
        roles = ['patient', 'clinician', 'admin']
    }

    const page = paginationParams.page;
    const limit = paginationParams.limit;
    const offset = limit * page;

    const roleCondition = roles.map(role => `r.name = '${role}'`).join(' OR ')

    const query = `
        WITH user_data AS (
        SELECT
            u.id,
            u.email,
            u.first_name,
            u.last_name,
            u.status,
            u.created_at,
            u.profile_url,
            r.name as role,
            ROW_NUMBER() OVER (PARTITION BY r.name ORDER BY u.created_at DESC) as row_num
        FROM private.user u
        JOIN private.role r ON u.role_id = r.id
        WHERE ${roleCondition}
        ),
        paginated_users AS (
            SELECT *
            FROM user_data
            WHERE row_num BETWEEN $1 + 1 AND $1 + $2
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
            JOIN paginated_users pu ON ap.user_id = pu.id
            WHERE pu.role = 'admin'
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
            JOIN paginated_users pu ON cp.user_id = pu.id
            WHERE pu.role = 'clinician'
        ),
        patient_profiles AS (
            SELECT
                pp.user_id,
                jsonb_build_object(
                'user_id', pp.user_id,
                'created_at', pp.created_at
                ) as profile_data
            FROM private.patient_profile pp
            JOIN paginated_users pu ON pp.user_id = pu.id
            WHERE pu.role = 'patient'
        )
        SELECT
        pu.*,
        CASE WHEN pu.role = 'admin' THEN ap.owner ELSE null END as owner,
        COALESCE(
            ap.profile_data,
            cp.profile_data,
            pp.profile_data,
            'null'::jsonb
        ) as profile
        FROM paginated_users pu
        LEFT JOIN admin_profiles ap ON pu.id = ap.user_id AND pu.role = 'admin'
        LEFT JOIN clinician_profiles cp ON pu.id = cp.user_id AND pu.role = 'clinician'
        LEFT JOIN patient_profiles pp ON pu.id = pp.user_id AND pu.role = 'patient'
        ORDER BY
        CASE pu.role
            WHEN 'admin' THEN 1
            WHEN 'clinician' THEN 2
            WHEN 'patient' THEN 3
            ELSE 4
        END,
        pu.created_at DESC
    `
    const result = await db.query<DBMinimalUser>(query, [offset, limit])
    return result
}
