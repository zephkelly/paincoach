import type { DBTransaction } from '~~/server/types/db';

import type { DBClinicianUserRegistrationData } from '@@/shared/types/v1/user/role/clinician/register';



export class ClinicianUserRepository {
    /**
     * Create a clinician profile
     */
    public static async createClinicianProfile(
        transaction: DBTransaction,
        user_id: string,
        role_data: DBClinicianUserRegistrationData
    ): Promise<void> {
        console.log('createClinicianProfile', user_id, role_data);
        await transaction.query(`
            INSERT INTO private.clinician_profile (
                user_id,
                ahprah_registration_number,
                specialisation,
                practice_name,
                abn
            ) VALUES (
                $1, $2, $3, $4, $5
            )
        `, [
            user_id,
            role_data.ahprah_registration_number,
            role_data.specialisation,
            role_data.practice_name,
            role_data.abn,
        ]);
    }
}