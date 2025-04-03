import { z } from 'zod';
import { createSchemaValidator } from '@@/shared/utils/zod/new';

import { DBUserInvitationSchema, InvitationStatusSchema } from './index';
import { UUIDSchema } from '@@/shared/schemas/primitives';



export const BasicUserInvitationSchema = DBUserInvitationSchema.pick({
    public_user_id: true,
    email: true,
    primary_role: true,
    roles: true,
    invitation_token: true,
    expires_at: true,
}).extend({
    inviter_name: z.string(),
    inviter_profile_url: z.string().url().nullable(),

    linked_user_public_id: UUIDSchema.nullable(),

    expires_at: z.coerce.date(),

    // status: InvitationStatusSchema,
});


export const BasicUserInvitationValidator = createSchemaValidator(BasicUserInvitationSchema);