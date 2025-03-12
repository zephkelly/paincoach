import { z } from "zod";
import { createZodValidationError } from '@@/shared/utils/zod/error';

import { DBAdminUserSchema, AdminUserSchema } from "./admin";
import { DBClinicianUserSchema, ClinicianUserSchema } from "./clinician";
import { DBPatientUserSchema, PatientUserSchema } from "./patient";

import { type User } from '../../types/users'



export { UserRoleSchema, AccountStatus, validateUserRole } from './base'

export const DBUserSchema = z.discriminatedUnion('role', [
    DBAdminUserSchema,
    DBClinicianUserSchema,
    DBPatientUserSchema
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

export const UserSchema = z.discriminatedUnion('role', [
    AdminUserSchema,
    ClinicianUserSchema,
    PatientUserSchema
]);


export function validateUser(data: User) {
    const parsedResult = UserSchema.safeParse(data)

    if (!parsedResult.success) {
        throw createZodValidationError(parsedResult.error)
    }

    return parsedResult.data
}

export function validateUsers(data: User[]) {
    const parsedResult = UserSchema.array().safeParse(data)

    if (!parsedResult.success) {
        throw createZodValidationError(parsedResult.error)
    }

    return parsedResult.data
}