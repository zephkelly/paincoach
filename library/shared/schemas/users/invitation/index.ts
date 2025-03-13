import { z } from 'zod';
import { createZodValidationError } from '@@/shared/utils/zod/error';

import { UserRoleSchema } from '../base';
import { UserInvitePartialSchema } from './request';
import type { UserInvitation } from '@@/shared/types/users/invitation';

import { BigIntIDSchema } from '@@/shared/schemas/primitives';




export const RegistrationTypeSchema = z.enum(['partial', 'full']);
export const InvitationStatusSchema = z.enum(['pending', 'opened', 'completed', 'expired']);

// refine id make sure that it is converted to a number
export const UserInvitationSchema = z.object({
    id: BigIntIDSchema,
    email: z.string().email(),
    phone_number: z.string().nullish(),
    user_id: z.string().uuid().nullish(),
    invitation_token: z.string().uuid(),
    invited_by: z.string().uuid(),
    role_id: z.string().uuid(),
    role_name: UserRoleSchema,
    registration_type: RegistrationTypeSchema,
    expires_at: z.date(),
    status: InvitationStatusSchema,
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),

    registration_data: UserInvitePartialSchema.optional(),
});


export function validateUserInvitation(data: UserInvitation) {
    const parsedResult = UserInvitationSchema.safeParse(data)

    if (!parsedResult.success) {
        console.log(parsedResult.error)
        throw createZodValidationError(parsedResult.error)
    }

    return parsedResult.data
}