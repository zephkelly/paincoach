import { z } from 'zod';

import { BaseUserSchema } from './base';
import { type PatientUser } from '../../types/users/patient';



export const PatientUserSchema = BaseUserSchema.extend({
    role: z.literal('patient'),

    date_of_birth: z.date()
        .refine((date) => {
            return date <= new Date()
        }, 'Date of birth cannot be in the future'),
    
    emergency_contact_name: z.string()
        .max(255, 'Emergency contact name must be less than 255 characters')
        .nullable(),
    
    emergency_contact_phone: z.string()
        .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid emergency contact phone number format')
        .max(50, 'Emergency contact phone must be less than 50 characters')
        .nullable(),
    
    registration_code: z.string()
        .min(1, 'Registration code is required')
        .max(50, 'Registration code must be less than 50 characters')
});


export function safeValidatePatientUser(data: PatientUser) {
    const parsedResult = PatientUserSchema.safeParse(data)

    if (!parsedResult.success) {
        throw new Error(parsedResult.error.errors[0].message)
    }

    return parsedResult.data
}