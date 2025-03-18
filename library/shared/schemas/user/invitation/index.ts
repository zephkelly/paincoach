import { z } from 'zod';
import { createZodValidationError } from '@@/shared/utils/zod/error';

import { UserRoleSchema } from '../base';
import { UserInvitePartialSchema } from './request';
import type { DBUserInvitation, UserInvitation } from '@@/shared/types/users/invitation';

import { BigIntIDSchema } from '@@/shared/schemas/primitives';




export const RegistrationTypeSchema = z.enum(['partial', 'full']);
export const InvitationRoleSchema = z.enum(['admin', 'clinician', 'patient']);
export const InvitationStatusSchema = z.enum(['pending', 'opened', 'completed', 'expired']);

// refine id make sure that it is converted to a number
export const DBUserInvitationSchema = z.object({
    id: BigIntIDSchema,
    email: z.string().email(),
    phone_number: z.string().nullish(),
    user_id: z.string().uuid(),
    linked_user_id: z.string().uuid().nullish(),
    invitation_token: z.string().uuid(),
    invited_by: z.string().uuid(),
    role_id: z.string().uuid(),
    registration_type: RegistrationTypeSchema,
    expires_at: z.date(),
    status: InvitationStatusSchema,
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),

    registration_data: UserInvitePartialSchema.optional(),
});

export const UserInvitationSchema = DBUserInvitationSchema.omit({
    id: true,
    linked_user_id: true,
    invited_by: true,
    role_id: true,
    status: true,
    created_at: true,
    updated_at: true,
}).extend({
    role_name: InvitationRoleSchema,
    inviter_name: z.string(),
    inviter_profile_url: z.string().url().nullable(),
    inviter_role_name: UserRoleSchema,
});



export function validateDBUserInvitation(data: DBUserInvitation) {
    const parsedResult = DBUserInvitationSchema.safeParse(data)

    if (!parsedResult.success) {
        throw createZodValidationError(parsedResult.error)
    }

    return parsedResult.data
}

export function validateUserInvitation(data: UserInvitation) {
    const parsedResult = UserInvitationSchema.safeParse(data)

    if (!parsedResult.success) {
        throw createZodValidationError(parsedResult.error)
    }

    return parsedResult.data
}