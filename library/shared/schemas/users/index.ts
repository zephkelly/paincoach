import { z } from "zod";

import { AdminUserSchema } from "./admin";
import { ClinicianUserSchema } from "./clinician";
import { PatientUserSchema } from "./patient";

import { type User } from '../../types/users'



export { UserRoleSchema, AccountStatus, validateUserRole } from './base'

export const UserSchema = z.discriminatedUnion('role', [
    AdminUserSchema,
    ClinicianUserSchema,
    PatientUserSchema
]
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


export function validateUser(data: User) {
    const parsedResult = UserSchema.safeParse(data)

    if (!parsedResult.success) {
        throw new Error(parsedResult.error.errors[0]?.message)
    }

    return parsedResult.data
}