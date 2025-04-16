import { z } from 'zod';

import { DBUserInvitationSchema } from './index';
import { createSchemaValidator } from '@@/layers/ember/utils/validator';



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

export const LimitedUserInvitationValidator = createSchemaValidator(LimitedUserInvitationSchema);