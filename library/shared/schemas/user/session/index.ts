import { z } from 'zod';
import { UUIDSchema } from '@@/shared/schemas/primitives';

import { UserRoleSchema } from '@@/shared/schemas/user';



export const SessionUserObjectSchema = z.object({
    user_id: UUIDSchema,
    email: z.string().email(),
    name: z.string(),
    user_role: UserRoleSchema,
    verified: z.boolean(),
});

export const SessionSecureDataObjectSchema = z.object({
    user_id: UUIDSchema,
    email: z.string().email(),
    verified: z.boolean(),
    user_role: UserRoleSchema,
});

export const SessionUserSessionObjectSchema = z.object({
    user: SessionUserObjectSchema,

    secure: SessionSecureDataObjectSchema,

    logged_in_at: z.date(),
    version: z.number(),
});