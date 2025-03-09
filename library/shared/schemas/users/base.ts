import { z, ZodError } from 'zod';

import { PHONE_REGEX } from '../../constants/phone';
import { version } from 'vue';
import type { UserRole } from '@@/shared/types/users';



export const UserRoleSchema = z.enum(['admin', 'clinician', 'patient'])
export const AccountStatus = z.enum(['active', 'inactive', 'pending'])

export const BaseUserSchema = z.object({
    id: z.string().uuid(),

    email: z.string()
        .email('Invalid email format')
        .max(255, 'Email must be less than 255 characters'),

    verified: z.boolean().default(false),

    phone_number: z.string()
        .regex(PHONE_REGEX, 'Invalid phone number format')
        .max(50, 'Phone number must be less than 50 characters')
        .nullable(),

    first_name: z.string()
        .min(1, 'First name is required')
        .max(255, 'First name must be less than 255 characters'),

    last_name: z.string()
        .min(1, 'Last name is required')
        .max(255, 'Last name must be less than 255 characters')
        .nullable(),

    password_hash: z.string()
        .min(1, 'Password hash is required')
        .max(255, 'Password hash must be less than 255 characters')
        .nullable(),

    role: UserRoleSchema,

    role_id: z.string().uuid(),

    status: AccountStatus.default('pending'),

    registration_complete: z.boolean().default(false),

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

    updated_at: z.date().default(() => new Date()),

    version: z.number().default(1)
})


export function validateUserRole(role: string): UserRole {
    try {
        return UserRoleSchema.parse(role)
    }
    catch (error: unknown) {
        if (error instanceof ZodError) {
            throw error.errors
        }

        throw error
    }
}

export function validateUserRoles(roles: string[]): boolean {
    for (const role of roles) {
        if (!UserRoleSchema.safeParse(role).success) {
            return false
        }
    }
    return true
}