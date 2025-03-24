import { z } from 'zod';
import { createZodValidationError } from '@@/shared/utils/zod/error';

import { DBBaseUserSchema, DBBaseUserWithRolesSchema } from './base';


export const BaseMinimalUserSchema = DBBaseUserSchema.pick({
    uuid: true,
    primary_role: true,
    email: true,
    status: true,
    profile_url: true,
    first_name: true,
    last_name: true,
    created_at: true,
})

export const BaseMinimalUserWithRolesSchema = DBBaseUserWithRolesSchema.pick({
    uuid: true,
    primary_role: true,
    roles: true,
    email: true,
    status: true,
    profile_url: true,
    first_name: true,
    last_name: true,
    created_at: true,
})

export const MinimalOwnerUserSchema = BaseMinimalUserSchema.extend({
    primary_role: z.literal('owner'),
});

export const MinimalOwnerUserWithRolesSchema = BaseMinimalUserWithRolesSchema.extend({
    primary_role: z.literal('owner'),
});

export const MinimalAdminUserSchema = BaseMinimalUserSchema.extend({
    primary_role: z.literal('admin'),
});

export const MinimalAdminUserWithRolesSchema = BaseMinimalUserWithRolesSchema.extend({
    primary_role: z.literal('admin'),
});

export const MinimalClinicianUserSchema = BaseMinimalUserSchema.extend({
    primary_role: z.literal('clinician'),
});

export const MinimalClinicianUserWithRolesSchema = BaseMinimalUserWithRolesSchema.extend({
    primary_role: z.literal('clinician'),
});

export const MinimalPatientUserSchema = BaseMinimalUserSchema.extend({
    primary_role: z.literal('patient'),
});

export const MinimalPatientUserWithRolesSchema = BaseMinimalUserWithRolesSchema.extend({
    primary_role: z.literal('patient'),
});




export const MinimalUserSchema = z.discriminatedUnion('primary_role', [
    MinimalOwnerUserSchema,
    MinimalAdminUserSchema,
    MinimalClinicianUserSchema,
    MinimalPatientUserSchema
]);
export function validateMinimalUser(data: any) {
    const parsedResult = MinimalUserSchema.safeParse(data);
    if (!parsedResult.success) {
        throw createZodValidationError(parsedResult.error);
    }
    return parsedResult.data;
}

export const MinimalUserWithRolesSchema = z.discriminatedUnion('primary_role', [
    MinimalOwnerUserWithRolesSchema,
    MinimalAdminUserWithRolesSchema,
    MinimalClinicianUserWithRolesSchema,
    MinimalPatientUserWithRolesSchema
]);
export function validateMinimalUserWithRoles(data: any) {
    const parsedResult = MinimalUserWithRolesSchema.safeParse(data);
    if (!parsedResult.success) {
        throw createZodValidationError(parsedResult.error);
    }
    return parsedResult.data;
}