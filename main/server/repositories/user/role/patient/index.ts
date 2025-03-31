import type { DBTransaction } from '~~/server/types/db';

import type { DBPatientUserRegistrationData } from '@@/shared/types/v1/user/role/patient/register';



export class PatientUserRepository {
    /**
     * Create a patient profile
     */
    public static async createPatientProfile(
        transaction: DBTransaction,
        user_id: string,
        role_data: DBPatientUserRegistrationData
    ): Promise<void> {
        await transaction.query(`
            INSERT INTO private.patient_profile (
                user_id
            ) VALUES (
                $1
            )
        `, [
            user_id,
        ]);
    }
}