import { z } from 'zod';

import { DBBaseUserSchema, DBBaseUserWithRolesSchema } from './base';


export const BaseLimitedUserSchema = DBBaseUserSchema.pick({
    public_id: true,
    primary_role: true,
    email: true,
    status: true,
    profile_url: true,
    first_name: true,
    last_name: true,
    created_at: true,
})

export const BaseLimitedUserWithRolesSchema = DBBaseUserWithRolesSchema.pick({
    public_id: true,
    primary_role: true,
    roles: true,
    email: true,
    status: true,
    profile_url: true,
    first_name: true,
    last_name: true,
    created_at: true,
})

export const LimitedOwnerUserSchema = BaseLimitedUserSchema.extend({
    primary_role: z.literal('owner'),
});

export const LimitedOwnerUserWithRolesSchema = BaseLimitedUserWithRolesSchema.extend({
    primary_role: z.literal('owner'),
});

export const LimitedAdminUserSchema = BaseLimitedUserSchema.extend({
    primary_role: z.literal('admin'),
});

export const LimitedAdminUserWithRolesSchema = BaseLimitedUserWithRolesSchema.extend({
    primary_role: z.literal('admin'),
});

export const LimitedClinicianUserSchema = BaseLimitedUserSchema.extend({
    primary_role: z.literal('clinician'),
});

export const LimitedClinicianUserWithRolesSchema = BaseLimitedUserWithRolesSchema.extend({
    primary_role: z.literal('clinician'),
});

export const LimitedPatientUserSchema = BaseLimitedUserSchema.extend({
    primary_role: z.literal('patient'),
});

export const LimitedPatientUserWithRolesSchema = BaseLimitedUserWithRolesSchema.extend({
    primary_role: z.literal('patient'),
});




export const LimitedUserSchema = z.discriminatedUnion('primary_role', [
    LimitedOwnerUserSchema,
    LimitedAdminUserSchema,
    LimitedClinicianUserSchema,
    LimitedPatientUserSchema
]);
export function validateLimitedUser(data: any) {
    const parsedResult = LimitedUserSchema.safeParse(data);
    if (!parsedResult.success) {
        throw 'Invalid limited user';
    }
    return parsedResult.data;
}

export const LimitedUserWithRolesSchema = z.discriminatedUnion('primary_role', [
    LimitedOwnerUserWithRolesSchema,
    LimitedAdminUserWithRolesSchema,
    LimitedClinicianUserWithRolesSchema,
    LimitedPatientUserWithRolesSchema
]);
export function validateLimitedUserWithRoles(data: any) {
    const parsedResult = LimitedUserWithRolesSchema.safeParse(data);
    if (!parsedResult.success) {
        throw 'Invalid limited user with roles';
    }
    return parsedResult.data;
}
export function validateLimitedUsersWithRoles(data: any[]) {
    const parsedResult = LimitedUserWithRolesSchema.array().safeParse(data);
    if (!parsedResult.success) {
        throw 'Invalid limited users with roles';
    }
    return parsedResult.data;
}