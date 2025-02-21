import { z } from "zod";

import { AdminUserSchema } from "./admin";
import { ClinicianUserSchema } from "./clinician";
import { PatientUserSchema } from "./patient";


export { UserRoleSchema } from './base'

export const UserSchema = z.discriminatedUnion('role', [
    AdminUserSchema,
    ClinicianUserSchema,
    PatientUserSchema
]
    ).refine(
        (data: any) => data.role === 'clinician',
        {
            message: 'Role must be clinician for this schema'
        }
    ).refine(
        (data) => {
            if (data.last_data_sharing_revocation_date && !data.last_data_sharing_consent_date) {
                return false
            }

            if (data.last_data_sharing_revocation_date && data.last_data_sharing_consent_date) {
                return data.last_data_sharing_revocation_date > data.last_data_sharing_consent_date
            }

            return true
        },
        {
            message: 'Invalid data sharing dates: Revocation date must be after consent date and consent date is required for revocation'
        }
    ).refine(
        (data) => {
            if (data.last_data_sharing_revocation_date && data.data_sharing_enabled) {
                return false
            }
            return true
        },
        {
            message: 'Data sharing cannot be enabled if there is a revocation date'
        }
    )


export function safeValidateUser(data: any) {
    const parsedResult = UserSchema.safeParse(data)

    if (!parsedResult.success) {
        throw new Error(parsedResult.error.errors[0].message)
    }

    return parsedResult.data
}



// CREATE TABLE users (
//     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     email VARCHAR(255) UNIQUE NOT NULL,
//     phone_number VARCHAR(50),
//     password_hash VARCHAR(255) NOT NULL,
//     role user_role NOT NULL,
//     status account_status DEFAULT 'pending',
//     data_sharing_enabled BOOLEAN DEFAULT FALSE,
//     last_data_sharing_consent_date TIMESTAMP WITH TIME ZONE,
//     data_sharing_revocation_date TIMESTAMP WITH TIME ZONE,
//     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
// );