import { z, ZodError } from 'zod';

import { PHONE_REGEX } from '../../constants/phone';
import type { UserRole } from '@@/shared/types/users';



export const UserRoleSchema = z.enum(['super_admin', 'admin', 'clinician', 'patient', 'incomplete_user'])
export const AccountStatus = z.enum(['active', 'inactive', 'pending'])
export const UserTitleSchema = z.enum(['Mr', 'Mrs', 'Ms', 'Miss', 'Dr', 'Prof'])

export const BaseDBUserSchema = z.object({
    id: z.string().uuid(),

    email: z.string()
        .email('Invalid email format')
        .max(255, 'Email must be less than 255 characters'),

    last_email_bounced_date: z.date().nullable().optional(),

    verified: z.boolean(),

    phone_number: z.string()
        .regex(PHONE_REGEX, 'Invalid phone number format')
        .max(50, 'Phone number must be less than 50 characters')
        .nullable().optional(),

    title: UserTitleSchema.nullable(),

    first_name: z.string()
        .min(1, 'First name is required')
        .max(255, 'First name must be less than 255 characters'),

    last_name: z.string()
        .min(1, 'Last name is required')
        .max(255, 'Last name must be less than 255 characters')
        .nullable(),

    profile_url: z.string().nullable().optional(),

    password_hash: z.string()
        .min(1, 'Password hash is required')
        .max(255, 'Password hash must be less than 255 characters')
        .nullable(),

    role: UserRoleSchema,

    status: AccountStatus.default('pending'),

    registration_complete: z.boolean(),

    data_sharing_enabled: z.boolean(),

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

    created_at: z.date(),

    updated_at: z.date(),

    version: z.number()
})

export const BaseUserSchema = BaseDBUserSchema.omit({
    verified: true,
    password_hash: true,
    registration_complete: true,
    data_sharing_enabled: true,
    last_data_sharing_consent_date: true,
    last_data_sharing_revocation_date: true,
    updated_at: true,
    version: true
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