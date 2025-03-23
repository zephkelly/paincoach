import { faker } from '@faker-js/faker';

import { type DBTransaction } from "~~/server/types/db";
import { type PatientUser, type Role } from "@@/shared/types/users";
import { type SecureSessionData } from '#auth-utils';

type PatientInfoClinicianView = PatientUser & { relationship_start_date: Date, relationship_id: string }


export async function getUsersClinicianPatients(
    db: DBTransaction,
    paginationParams: PaginationParams,
    id: string
): Promise<PatientInfoClinicianView[]> {
    const page = paginationParams.page;
    const limit = paginationParams.limit
    const offset = limit * page

    const query = `
        WITH patient_data AS (
            SELECT 
                u.id,
                u.email,
                u.first_name,
                u.last_name,
                u.title,
                u.status,
                u.created_at,
                u.profile_url,
                r.name as role,
                cpr.start_date as relationship_start_date,
                cpr.id as relationship_id
            FROM private.clinician_patient_relationship cpr
            JOIN private.patient_profile pp ON cpr.patient_id = pp.user_id
            JOIN private.user u ON pp.user_id = u.id
            JOIN private.role r ON u.role_id = r.id
            WHERE cpr.clinician_id = $1
            AND cpr.status = 'active'
            ORDER BY cpr.start_date DESC
            LIMIT $2 OFFSET $3
        )
        SELECT 
        pd.*,
        jsonb_build_object(
            'user_id', pp.user_id,
            'created_at', pp.created_at,
            'private_data', pp.private_data
        ) as profile
        FROM patient_data pd
        LEFT JOIN private.patient_profile pp ON pd.id = pp.user_id
    `

    const result = await db.query<PatientInfoClinicianView>(query, [id, limit, offset])
    return result
}


type AdminPatientInfoClinicianView = Exclude<PatientUser, 'private_data'> & { relationship_start_date: Date, relationship_id: string }

export async function getAdminUsersClinicianPatients(
    db: DBTransaction,
    paginationParams: PaginationParams,
    currentId: string,
    secureSession: { id: string, role: Role }
): Promise<AdminPatientInfoClinicianView[] | PatientInfoClinicianView[]> {
    const page = paginationParams.page;
    const limit = paginationParams.limit
    const offset = limit * page

    // Admin impersonation check
    if (currentId === secureSession.id && secureSession.role === 'admin') {
        // Return mock data for admin impersonation
        return generateMockPatientData(limit);
    }

    // When not impersonating, validate the user is actually a clinician
    if (currentId !== secureSession.id) {
        // Verify the current user is a clinician before proceeding
        const isClinicianQuery = `
            SELECT EXISTS (
                SELECT 1 FROM private.user u
                JOIN private.role r ON u.role_id = r.id
                WHERE u.id = $1 AND r.name = 'clinician'
            ) as is_clinician
        `;
        const clinicianCheck = await db.query<{ is_clinician: boolean }>(isClinicianQuery, [currentId]);

        if (!clinicianCheck[0]?.is_clinician) {
            throw new Error('Unauthorized: User is not a clinician');
        }
    }

    const query = `
        WITH patient_data AS (
            SELECT
                u.id,
                u.email,
                u.first_name,
                u.last_name,
                u.title,
                u.status,
                u.created_at,
                u.profile_url,
                r.name as role,
                cpr.start_date as relationship_start_date,
                cpr.id as relationship_id
            FROM private.clinician_patient_relationship cpr
            JOIN private.patient_profile pp ON cpr.patient_id = pp.user_id
            JOIN private.user u ON pp.user_id = u.id
            JOIN private.role r ON u.role_id = r.id
            WHERE cpr.clinician_id = $1
            AND cpr.status = 'active'
            ORDER BY cpr.start_date DESC
            LIMIT $2 OFFSET $3
        )
        LEFT JOIN private.patient_profile pp ON pd.id = pp.user_id
    `
    const result = await db.query<AdminPatientInfoClinicianView>(query, [currentId, limit, offset])
    return result
}

/**
 * Generates mock patient data for admin impersonation
 */
function generateMockPatientData(count: number): PatientInfoClinicianView[] {
    const mockPatients: PatientInfoClinicianView[] = [];

    for (let i = 0; i < count; i++) {
        const startDate = faker.date.past();
        const createdAt = faker.date.past({ refDate: startDate });

        mockPatients.push({
            id: faker.string.uuid(),
            email: faker.internet.email(),
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            title: faker.person.prefix() as any,
            status: 'active',
            created_at: createdAt,
            profile_url: faker.image.avatar(),
            role: 'patient',
            relationship_start_date: startDate,
            relationship_id: faker.string.uuid(),
            private_data: {
                date_of_birth: faker.date.birthdate(),
            }
        });
    }

    return mockPatients;
}