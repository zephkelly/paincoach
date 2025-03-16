import { z } from 'zod';
import { createZodValidationError } from '@@/shared/utils/zod/error';

import { BaseDBUserSchema, BaseUserSchema } from './base';
import { type PatientUser } from '../../types/users/patient';


export const PatientUserPrivateDataSchema = z.object({
    date_of_birth: z.date()
        .refine((date) => {
            if (date) {
                return date <= new Date()
            }
            return true
        }, 'Date of birth cannot be in the future'),
});

export const DBPatientUserFieldsSchema = z.object({
    role: z.literal('patient'),
    private_data: PatientUserPrivateDataSchema,
});

export const DBPatientUserSchema = BaseDBUserSchema.merge(DBPatientUserFieldsSchema);

export const PatientUserSchema = BaseUserSchema.merge(DBPatientUserFieldsSchema);


export function validatePatientUser(data: PatientUser) {
    const parsedResult = PatientUserSchema.safeParse(data)

    if (!parsedResult.success) {
        throw createZodValidationError(parsedResult.error)
    }

    return parsedResult.data
}

export function validatePatientUsers(data: PatientUser[]) {
    const parsedResult = PatientUserSchema.array().safeParse(data)

    if (!parsedResult.success) {
        throw createZodValidationError(parsedResult.error)
    }

    return parsedResult.data
}