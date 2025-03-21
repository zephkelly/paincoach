import { z } from 'zod';
import { createZodValidationError } from '@@/shared/utils/zod/error';

import { UserRoleSchema } from './base';
import { BaseUserInviteSchema } from './invitation/create';

import { AdminUserSchema, DBAdminUserFieldsSchema } from './admin';
import { ClinicianUserSchema, DBClinicianUserFieldsSchema } from './clinician';
import { PatientUserSchema, DBPatientUserFieldsSchema } from './patient';

import { DBPatientMedicationSchema } from '../medication/index';

import { DBEncryptedPatientMedicationDataV1Schema } from '../medication/v1';



export const BaseUserRegisterSchema = BaseUserInviteSchema.extend({
    invitation_token: z.string().uuid(),

    id: z.string().uuid(),
    role: z.string(),
    password: z.string(),
    confirm_password: z.string(),
    confirm_email: z.string().email(),
    profile_url: z.string().url().nullable().optional(),
    
    will_use_app: z.boolean().default(false),
    medications: z.array(
        DBEncryptedPatientMedicationDataV1Schema
    ).nullable().optional()
});

export const BaseUserRegisterPartialSchema = BaseUserRegisterSchema.partial()


export const ClinicianRegisterSchema = BaseUserRegisterSchema.extend({
    ...DBClinicianUserFieldsSchema.shape,
});
export const ClinicianRegisterPartialSchema = ClinicianRegisterSchema.partial().extend({
    role: z.literal('clinician'),
})


export const PatientRegisterSchema = BaseUserRegisterSchema.extend({
    ...DBPatientUserFieldsSchema.shape,
    will_use_app: z.literal(true),
});
export const PatientRegisterPartialSchema = PatientRegisterSchema.partial().extend({
    role: z.literal('patient'),
    will_use_app: z.literal(true),
})

const UndefinedRegisterPartialSchema = BaseUserRegisterSchema.partial().extend({
    role: z.undefined(),
});


export const AdminRegisterSchema = BaseUserRegisterSchema.extend({
    ...DBAdminUserFieldsSchema.shape,
    allowed_additional_profiles: z.array(UserRoleSchema).optional(),
    additional_profiles: z.array(
        z.discriminatedUnion('role', [
            DBPatientUserFieldsSchema,
            DBClinicianUserFieldsSchema.partial(),
        ])
    ).max(1).optional(),
});
export const AdminRegisterPartialSchema = AdminRegisterSchema.partial().extend({
    role: z.literal('admin'),
})

export const UserRegisterSchema = z.discriminatedUnion('role', [
    AdminRegisterSchema,
    ClinicianRegisterSchema,
    PatientRegisterSchema,
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
    UndefinedRegisterPartialSchema
]);

export function validateUserRegisterPartial(data: unknown) {
    const parsedData = UserRegisterPartialSchema.safeParse(data);

    if (!parsedData.success) {
        throw createZodValidationError(parsedData.error);
    }

    return parsedData.data;
}