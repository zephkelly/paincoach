import { type DBTransaction } from "~~/server/types/db";

import { type User, type UserRole } from "~~lib/shared/types/users";
import { type AdminUser } from "~~lib/shared/types/users/admin";
import { type ClinicianUser } from "~~lib/shared/types/users/clinician";
import { type PatientUser } from "~~lib/shared/types/users/patient";
import { safeValidateUser } from "~~lib/shared/schemas/users";



export async function getUsersByIds(
    db: DBTransaction,
    userIds: string[]
): Promise<User[]> {
    if (!userIds.length) return [];
    
    const userResult = await db.query(`
        SELECT 
            u.*,
            r.name as role,
            -- Admin fields (none)
            -- Clinician fields
            cp.license_number,
            cp.specialization,
            cp.practice_name,
            -- Patient fields
            pp.date_of_birth,
            pp.emergency_contact_name,
            pp.emergency_contact_phone,
            pp.registration_code
        FROM private.user u
        JOIN private.role r ON u.role_id = r.id
        LEFT JOIN private.admin_profile ap ON u.id = ap.user_id AND r.name = 'admin'
        LEFT JOIN private.clinician_profile cp ON u.id = cp.user_id AND r.name = 'clinician'
        LEFT JOIN private.patient_profile pp ON u.id = pp.user_id AND r.name = 'patient'
        WHERE u.id = ANY($1::uuid[])
    `, [userIds]);

    return userResult.map(userData => {
        const userRole = userData?.role as UserRole;

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
        
        return safeValidateUser(fullUser);
    });
}