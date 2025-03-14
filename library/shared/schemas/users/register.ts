import { z } from 'zod';
import { createZodValidationError } from '@@/shared/utils/zod/error';

import { BaseUserInviteSchema } from './invitation/request';

import { AdminUserSchema } from './admin';
import { ClinicianUserSchema } from './clinician';
import { PatientUserSchema } from './patient';



export const BaseUserRegisterSchema = BaseUserInviteSchema.extend({
    id: z.string().uuid(),
    role: z.string(),
    password: z.string(),
    confirm_password: z.string(),
    confirm_email: z.string().email(),
    profile_url: z.string().url().nullable().optional(),
    invitation_token: z.string().uuid(),
});


const AdminRegisterSchema = BaseUserRegisterSchema.extend({
    role: z.literal('admin'),
});
const AdminRegisterPartialSchema = AdminRegisterSchema.partial().extend({
    role: z.literal('admin')
})

const ClinicianRegisterSchema = BaseUserRegisterSchema.extend({
    role: z.literal('clinician'),
    ahprah_registration_number: z.string(),
    specialisation: z.string().optional(),
    practice_name: z.string().optional(),
    business_address: z.string().optional(),
    abn: z.string().optional(),
});
const ClinicianRegisterPartialSchema = ClinicianRegisterSchema.partial().extend({
    role: z.literal('clinician'),
})


const PatientRegisterSchema = BaseUserRegisterSchema.extend({
    role: z.literal('patient'),
});
const PatientRegisterPartialSchema = PatientRegisterSchema.partial().extend({
    role: z.literal('patient'),
})

const UndefinedRoleRegisterPartialSchema = BaseUserRegisterSchema.partial().extend({
    role: z.undefined(),
});


export const UserRegisterSchema = z.discriminatedUnion('role', [
    AdminUserSchema,
    ClinicianUserSchema,
    PatientUserSchema,
]);

export function validateUserRegister(data: unknown) {
    const parsedData = UserRegisterSchema.safeParse(data);

    if (!parsedData.success) {
        throw createZodValidationError(parsedData.error);
    }

    return parsedData.data;
}

export const UserRegisterPartialSchema = z.discriminatedUnion('role', [
    AdminRegisterPartialSchema,
    ClinicianRegisterPartialSchema,
    PatientRegisterPartialSchema,
    UndefinedRoleRegisterPartialSchema
]);

export function validateUserRegisterPartial(data: unknown) {
    const parsedData = UserRegisterPartialSchema.safeParse(data);

    if (!parsedData.success) {
        throw createZodValidationError(parsedData.error);
    }

    return parsedData.data;
}
