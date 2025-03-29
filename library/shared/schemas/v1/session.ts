import { z } from 'zod';
import { createZodValidationError } from '@@/shared/utils/zod/error';
import { UUIDSchema } from '@@/shared/schemas/primitives';

import { RoleSchema } from '@@/shared/schemas/v1/role';
import { Session } from 'inspector/promises';

import { DBUserInvitationDataSchema } from './user/invitation/data';



export const SessionUserObjectSchema = z.object({
    public_id: UUIDSchema,
    first_name: z.string(),

    primary_role: RoleSchema,
    roles: z.array(RoleSchema).min(1),

    verified: z.boolean(),
});

export const SessionSecureDataObjectSchema = z.object({
    id: UUIDSchema,
    public_id: UUIDSchema,
    
    email: z.string().email(),
    
    primary_role: RoleSchema,
    roles: z.array(RoleSchema).min(1),
    
    verified: z.boolean(),
});

export const RegisteredSessionObjectSchema = z.object({
    user: SessionUserObjectSchema,

    secure: SessionSecureDataObjectSchema,

    logged_in_at: z.coerce.date(),
    version: z.number(),
    id: UUIDSchema
});

export function validateRegisteredSessionObjectSchema(data: unknown): z.infer<typeof RegisteredSessionObjectSchema> {
    const parsedResult = RegisteredSessionObjectSchema.safeParse(data);
    if (!parsedResult.success) {
        throw createZodValidationError(parsedResult.error);
    }
    return parsedResult.data;
}


export const UnregisterdSessionObjectSchema = RegisteredSessionObjectSchema.extend({
    user: SessionUserObjectSchema.extend({
        verified: z.literal(false),
        first_name: z.string().nullable(),
        primary_role: z.literal('unregistered'),
        roles: z.array(z.literal('unregistered')),
    }),
    secure: SessionSecureDataObjectSchema.extend({
        id: z.null(),
        primary_role: z.literal('unregistered'),
        roles: z.array(z.literal('unregistered')),
        verified: z.literal(false),

        invitation_token: z.string().uuid(),
    }),
    invitation_data: DBUserInvitationDataSchema.optional(),
});

export function validateUnregisterdSessionObjectSchema(data: unknown): z.infer<typeof UnregisterdSessionObjectSchema> {
    const parsedResult = UnregisterdSessionObjectSchema.safeParse(data);
    if (!parsedResult.success) {
        throw createZodValidationError(parsedResult.error);
    }
    return parsedResult.data;
}