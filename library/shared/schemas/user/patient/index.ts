import { z } from 'zod';
import { createZodValidationError } from '@@/shared/utils/zod/error';

import { BaseDBUserSchema, BaseUserSchema } from '@@/shared/schemas/user/base';
import { type PatientUser } from '@@/shared/types/users/patient';


export const PatientUserPrivateDataSchema = z.object({
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