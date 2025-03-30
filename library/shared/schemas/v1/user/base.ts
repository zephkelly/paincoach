import { z } from 'zod';
import { createZodValidationError } from '@@/shared/utils/zod/error';

import { PHONE_REGEX } from '@@/shared/constants/phone';
import { UUIDSchema, BigIntSchema } from '../../primitives';

import { RoleSchema } from '../role';



export const DBUserStatusSchema = z.enum(['active', 'inactive', 'pending'])
export const DBUserTitleSchema = z.enum([
    'Prof',
    'Dr',
    'Mr',
    'Mrs',
    'Ms',
    'Miss',
    'No Title',
]);



export const DBBaseUserSchema = z.object({
    id: UUIDSchema,
    public_id: UUIDSchema,

    primary_role: RoleSchema,

    email: z.string()
        .email('Invalid email format')
        .max(255, 'Email must be less than 255 characters'),
    last_email_bounced_date: z.date().nullable().optional(),

    verified: z.boolean(),
    
    phone_number: z.string()
        .regex(PHONE_REGEX, 'Invalid phone number format')
        .max(50, 'Phone number must be less than 50 characters')
        .nullable().optional(),

    first_name: z.string()
        .min(1, 'First name is required')
        .max(35, 'First name must be less than 35 characters'),

    last_name: z.string()
        .min(1, 'Last name is required')
        .max(50, 'Last name must be less than 50 characters')
        .nullable().optional(),

    title: DBUserTitleSchema.nullable().optional(),

    profile_url: z.string().nullable().optional(),

    password_hash: z.string()
        .min(1, 'Password hash is required')
        .max(255, 'Password hash must be less than 255 characters'),

    status: DBUserStatusSchema,

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

    version: z.literal(1).default(1).optional(),
});

export const DBBaseUserWithRolesSchema = DBBaseUserSchema.extend({
    roles: z.array(RoleSchema).min(1, 'User must have at least one role'),
});


export const BaseUserSchema = DBBaseUserSchema.omit({
    verified: true,
    password_hash: true,
    registration_complete: true,
    data_sharing_enabled: true,
    last_data_sharing_consent_date: true,
    last_data_sharing_revocation_date: true,
    updated_at: true,
    version: true
});

export const BaseUserWithRolesSchema = BaseUserSchema.extend({
    roles: z.array(RoleSchema).min(1, 'User must have at least one role'),
});


export function validateUserStatus(data: unknown): z.infer<typeof DBUserStatusSchema> {
    const parsedResult = DBUserStatusSchema.safeParse(data);
    if (!parsedResult.success) {
        throw createZodValidationError(parsedResult.error);
    }
    return parsedResult.data;
}