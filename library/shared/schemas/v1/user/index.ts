import { z } from "zod";
import { createZodValidationError } from "@@/shared/utils/zod/error";

import {
    DBOwnerUserSchema,
    DBOwnerUserWithRolesSchema,

    OwnerUserSchema,
    OwnerUserWithRolesSchema
} from "@@/shared/schemas/v1/user/role/owner";

import {
    DBAdminUserSchema,
    DBAdminUserWithRolesSchema,

    AdminUserSchema,
    AdminUserWithRolesSchema
} from "@@/shared/schemas/v1/user/role/admin";

import {
    DBClinicianUserSchema,
    DBClinicianUserWithRolesSchema,

    ClinicianUserSchema,
    ClinicianUserWithRolesSchema
} from "@@/shared/schemas/v1/user/role/clinician";

import {
    DBPatientUserSchema,
    DBPatientUserWithRolesSchema,

    PatientUserSchema,
    PatientUserWithRolesSchema
} from "@@/shared/schemas/v1/user/role/patient";



export const DBUserSchema = z.discriminatedUnion('primary_role', [
    DBOwnerUserSchema,
    DBAdminUserSchema,
    DBClinicianUserSchema,
    DBPatientUserSchema
]);

export function validateDBUser(data: unknown): z.infer<typeof DBUserSchema> {
    const parsedResult = DBUserSchema.safeParse(data);
    if (!parsedResult.success) {
        throw createZodValidationError(parsedResult.error);
    }
    return parsedResult.data;
}

export function validateDBUsers(data: unknown): z.infer<typeof DBUserSchema>[] {
    const parsedResult = z.array(DBUserSchema).safeParse(data);
    if (!parsedResult.success) {
        throw createZodValidationError(parsedResult.error);
    }
    return parsedResult.data;
}   



export const DBUserWithRolesSchema = z.discriminatedUnion('primary_role', [
    DBOwnerUserWithRolesSchema,
    DBAdminUserWithRolesSchema,
    DBClinicianUserWithRolesSchema,
    DBPatientUserWithRolesSchema
]);



export const UserSchema = z.discriminatedUnion('primary_role', [
    OwnerUserSchema,
    AdminUserSchema,
    ClinicianUserSchema,
    PatientUserSchema
]);

export function validateUser(data: unknown): z.infer<typeof UserSchema> {
    const parsedResult = UserSchema.safeParse(data);
    if (!parsedResult.success) {
        throw createZodValidationError(parsedResult.error);
    }
    return parsedResult.data;
}

export function validateUsers(data: unknown): z.infer<typeof UserSchema>[] {
    const parsedResult = z.array(UserSchema).safeParse(data);
    if (!parsedResult.success) {
        throw createZodValidationError(parsedResult.error);
    }
    return parsedResult.data;
}



export const UserWithRolesSchema = z.discriminatedUnion('primary_role', [
    OwnerUserWithRolesSchema,
    AdminUserWithRolesSchema,
    ClinicianUserWithRolesSchema,
    PatientUserWithRolesSchema
]);

export function validateUserWithRoles(data: unknown): z.infer<typeof UserWithRolesSchema> {
    const parsedResult = UserWithRolesSchema.safeParse(data);
    if (!parsedResult.success) {
        throw createZodValidationError(parsedResult.error);
    }
    return parsedResult.data;
}

export function validateUsersWithRoles(data: unknown): z.infer<typeof UserWithRolesSchema>[] {
    const parsedResult = z.array(UserWithRolesSchema).safeParse(data);
    if (!parsedResult.success) {
        throw createZodValidationError(parsedResult.error);
    }
    return parsedResult.data;
}