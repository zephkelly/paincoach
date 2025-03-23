import { z } from 'zod';
import { BigIntSchema, UUIDSchema } from '@@/shared/schemas/primitives';

import { RoleSchema } from '@@/shared/schemas/v1/role';



export const SessionUserObjectSchema = z.object({
    user_uuid: UUIDSchema,
    first_name: z.string(),
    email: z.string().email(),

    user_roles: z.array(RoleSchema),
    primary_role: RoleSchema,

    verified: z.boolean(),
});

export const SessionSecureDataObjectSchema = z.object({
    user_id: BigIntSchema,
    email: z.string().email(),
    
    user_roles: z.array(RoleSchema),
    primary_role: RoleSchema,

    invitation_token: z.string().uuid().nullable().optional(),
    
    verified: z.boolean(),
});

export const SessionUserSessionObjectSchema = z.object({
    user: SessionUserObjectSchema,

    secure: SessionSecureDataObjectSchema,

    logged_in_at: z.date(),
    version: z.number(),
});