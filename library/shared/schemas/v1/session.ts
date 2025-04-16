import { z } from 'zod';
import { createSchemaValidator } from '@@/layers/ember/utils/validator';
import { UUIDSchema } from '@@/shared/schemas/primitives';

import { RoleSchema } from '@@/shared/schemas/v1/role';

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
export const registeredSessionObjectValidator = createSchemaValidator(RegisteredSessionObjectSchema);

export const ClientRegisteredSessionObjectSchema = RegisteredSessionObjectSchema.omit({
    secure: true,
});
export const clientRegisteredSEssionObjectValidator = createSchemaValidator(ClientRegisteredSessionObjectSchema);


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
export const unregisterdSessionObjectValidator = createSchemaValidator(UnregisterdSessionObjectSchema);

export const ClientUnregisteredSessionObjectSchema = UnregisterdSessionObjectSchema.omit({
    secure: true,
});
export const clientUnregisteredSessionObjectValidator = createSchemaValidator(ClientUnregisteredSessionObjectSchema);