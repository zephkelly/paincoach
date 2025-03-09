import { z } from 'zod';

import { BaseUserSchema } from './base';
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

export const PatientUserSchema = BaseUserSchema.extend({
    role: z.literal('patient'),

    private_data: PatientUserPrivateDataSchema,
});


export function safeValidatePatientUser(data: PatientUser) {
    const parsedResult = PatientUserSchema.safeParse(data)

    if (!parsedResult.success) {
        throw new Error(parsedResult.error.errors[0]?.message)
    }

    return parsedResult.data
}