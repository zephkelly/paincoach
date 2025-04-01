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
                ahpra_registration_number,
                specialisation
            ) VALUES (
                $1, $2, $3
            )
        `, [
            user_id,
            role_data.ahpra_registration_number,
            role_data.specialisation
        ]);
    }
}