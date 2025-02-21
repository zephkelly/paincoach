import { z } from 'zod';

import { PHONE_PATTERN } from '../../constants/phone';



export const UserRoleSchema = z.enum(['admin', 'clinician', 'patient'])
const AccountStatus = z.enum(['active', 'inactive', 'pending'])

export const BaseUserSchema = z.object({
    id: z.string().uuid(),
    
    email: z.string()
        .email('Invalid email format')
        .max(255, 'Email must be less than 255 characters'),
    
    phone_number: z.string()
        .regex(PHONE_PATTERN, 'Invalid phone number format')
        .max(50, 'Phone number must be less than 50 characters')
        .nullable(),
    
    password_hash: z.string()
        .min(1, 'Password hash is required')
        .max(255, 'Password hash must be less than 255 characters'),
    
    role: UserRoleSchema,
    
    status: AccountStatus.default('pending'),
    
    data_sharing_enabled: z.boolean().default(false),
    
    last_data_sharing_consent_date: z.date()
        .nullable()
        .refine((date) => {
            if (date) {
                return date <= new Date()
            }
            return true
        }, 'Consent date cannot be in the future'),
    
    last_data_sharing_revocation_date: z.date()
        .nullable()
        .refine((date) => {
        if (date) {
            return date <= new Date()
        }
        return true
        }, 'Revocation date cannot be in the future'),
    
    created_at: z.date().default(() => new Date()),
    
    updated_at: z.date().default(() => new Date())
})