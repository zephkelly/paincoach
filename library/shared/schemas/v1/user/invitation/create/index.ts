import { z } from 'zod';

import { DBUserInvitationSchema } from '@@/shared/schemas/v1/user/invitation';
import { DBUserInvitationDataPartialSchema } from '../data';


export const CreateUserInvitationRequestSchema = DBUserInvitationSchema.pick({
    email: true,
    phone_number: true,
    invitation_data: true,
    primary_role: true,
    roles: true,
}).extend({
    confirm_email: z.string().email(),

    invitation_data: DBUserInvitationDataPartialSchema
});

export const CreateUserInvitationRequestPartialSchema = CreateUserInvitationRequestSchema.partial();


export function validateCreateUserInvitationRequest(data: unknown): z.infer<typeof CreateUserInvitationRequestSchema> {
    const parsedResult = CreateUserInvitationRequestSchema.refine(
        (val) => val.email === val.confirm_email, {
            message: 'Emails do not match',
        }
    ).safeParse(data);
    if (!parsedResult.success) {
        throw parsedResult.error;
    }
    return parsedResult.data;
}

export function validateCreateUserInvitationRequestPartial(data: unknown): z.infer<typeof CreateUserInvitationRequestPartialSchema> {
    const parsedResult = CreateUserInvitationRequestPartialSchema.safeParse(data);
    if (!parsedResult.success) {
        throw parsedResult.error;
    }
    return parsedResult.data;
}