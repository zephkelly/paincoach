import { z } from 'zod';
import { BaseUserSchema, BaseDBUserSchema } from './base';

import { type ClinicianUser } from '../../types/users/clinician';



export const DBClinicianUserFieldsSchema = z.object({
    role: z.literal('clinician'),
    
    ahprah_registration_number: z.string()
        .min(1, 'License number is required')
        .max(100, 'License number must be less than 100 characters'),

    specialisation: z.string()
        .max(100, 'Specialization must be less than 100 characters')
        .nullable(),

    practice_name: z.string()
        .max(255, 'Practice name must be less than 255 characters')
        .nullable(),

    business_address: z.string().optional(),

    abn: z.string().optional(),
});

export const DBClinicianUserSchema = BaseDBUserSchema.extend({
    ...DBClinicianUserFieldsSchema.shape,
});

export const ClinicianUserSchema = BaseUserSchema.extend({
    ...DBClinicianUserFieldsSchema.shape,
});

export function safeValidateClinicianUser(data: ClinicianUser) {
    const parsedResult = ClinicianUserSchema.safeParse(data)

    if (!parsedResult.success) {
        throw new Error(parsedResult.error.errors[0]?.message)
    }

    return parsedResult.data
}