import { z } from 'zod';
import { createZodValidationError } from '@@/shared/utils/zod/error';

import { RoleSchema } from '../../role';

import { DBUserInvitationSchema } from './index';



export const LimitedUserInvitationSchema = DBUserInvitationSchema.pick({
    public_user_id: true,
    email: true,
    phone_number: true,
    primary_role: true,
    roles: true,
    invitation_token: true,
    expires_at: true,
    invitation_data: true
}).extend({
    inviter_name: z.string(),
    inviter_profile_url: z.string().url().nullable(),

    expires_at: z.coerce.date(),
});



export function validateLimitedUserInvitation(data: unknown): z.infer<typeof LimitedUserInvitationSchema> {
    const parsedResult = LimitedUserInvitationSchema.safeParse(data);
    if (!parsedResult.success) {
        throw createZodValidationError(parsedResult.error);
    }
    return parsedResult.data;
}