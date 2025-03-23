import { z } from 'zod';
import { createZodValidationError } from '@@/shared/utils/zod/error';

import { DBBaseUserSchema, DBBaseUserWithRolesSchema } from './base';

import { MinimalOwnerUserSchema } from './role/owner/minimal';
import { MinimalAdminUserSchema } from './role/admin/minimal';
import { MinimalClinicianUserSchema } from './role/clinician/minimal';
import { MinimalPatientUserSchema } from './role/patient/minimal';



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


export const MinimalUserSchema = z.discriminatedUnion('primary_role', [
    MinimalOwnerUserSchema,
    MinimalAdminUserSchema,
    MinimalClinicianUserSchema,
    MinimalPatientUserSchema
]);

export const MinimalUserWithRolesSchema = z.discriminatedUnion('primary_role', [
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