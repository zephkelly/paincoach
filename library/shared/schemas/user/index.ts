import { z } from "zod";
import { createZodValidationError } from '@@/shared/utils/zod/error';

import { DBAdminUserSchema, AdminUserSchema } from "./admin";
import { DBClinicianUserSchema, ClinicianUserSchema } from "./clinician";
import { DBPatientUserSchema, PatientUserSchema } from "./patient/index";

import { type User } from '../../types/users'



export { UserRoleSchema, UserStatusSchema, validateUserRole } from './base'

export const DBUserSchema = z.discriminatedUnion('role', [
    DBAdminUserSchema,
    DBClinicianUserSchema,
    DBPatientUserSchema
]);

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