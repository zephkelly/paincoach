import { z } from 'zod';
import { createZodValidationError } from '@@/shared/utils/zod/error';

import { RoleSchema } from '../../role';

import { DBUserInvitationSchema } from './index';



export const MinimalUserInvitationSchema = DBUserInvitationSchema.omit({
    id: true,
    linked_user_id: true,
    invited_by: true,
    status: true,
    created_at: true,
    updated_at: true,
}).extend({
    inviter_name: z.string(),
    inviter_profile_url: z.string().url().nullable(),
    inviter_role_name: RoleSchema,
});



export function validateMinimalUserInvitation(data: unknown): z.infer<typeof MinimalUserInvitationSchema> {
    const parsedResult = MinimalUserInvitationSchema.safeParse(data);
    if (!parsedResult.success) {
        throw createZodValidationError(parsedResult.error);
    }
    return parsedResult.data;
}