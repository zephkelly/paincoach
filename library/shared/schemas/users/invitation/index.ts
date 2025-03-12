import { z } from 'zod';
import { createZodValidationError } from '@@/shared/utils/zod/error';

import { UserInvitePartialSchema } from './request';
import type { UserInvitation } from '@@/shared/types/users/invitation';



export const RegistrationTypeSchema = z.enum(['partial', 'full']);
export const InvitationStatusSchema = z.enum(['pending', 'completed', 'expired']);

export const UserInvitationSchema = z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    phone_number: z.string().nullish(),
    user_id: z.string().uuid().nullish(),
    invitation_token: z.string().uuid(),
    invited_by: z.string().uuid(),
    role_id: z.string().uuid(),
    registration_type: RegistrationTypeSchema,
    expires_at: z.date(),
    status: InvitationStatusSchema,
    created_at: z.date(),
    updated_at: z.date(),

    registration_data: UserInvitePartialSchema.optional(),
});


export function validateUserInvitation(data: UserInvitation) {
    const parsedResult = UserInvitationSchema.safeParse(data)

    if (!parsedResult.success) {
        throw createZodValidationError(parsedResult.error)
    }

    return parsedResult.data
}