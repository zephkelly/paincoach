import { z } from "zod";
import { createZodValidationError } from "@@/shared/utils/zod/error";

import { UUIDSchema, BigIntSchema } from "@@/shared/schemas/primitives";

import { DBBaseUserWithRolesSchema } from "../base";
import { DBUserInvitationDataSchema } from "./data";



export const InvitationRoleSchema = z.enum(['owner', 'admin', 'clinician', 'patient']); // TODO: Remove 'owner' from the enum after inviting lachlan
export const RegistrationTypeSchema = z.enum(['partial', 'full']);
export const InvitationStatusSchema = z.enum(['pending', 'opened', 'completed', 'expired']);


export const DBUserInvitationSchema = DBBaseUserWithRolesSchema.pick({
    primary_role: true,
    roles: true,

    email: true,
    phone_number: true,
}).extend({
    id: UUIDSchema,
    public_user_id: UUIDSchema,

    invitation_token: UUIDSchema,
    linked_user_id: UUIDSchema.nullish(),

    invited_by_user_id: UUIDSchema,
    status: InvitationStatusSchema,

    expires_at: z.date(),
    created_at: z.date(),
    updated_at: z.date(),

    invitation_data: DBUserInvitationDataSchema
});

export const DBUserInvitationPartialSchema = DBUserInvitationSchema.partial();



export function validateDBUserInvitation(data: unknown): z.infer<typeof DBUserInvitationSchema> {
    const parsedResult = DBUserInvitationSchema.safeParse(data);
    if (!parsedResult.success) {
        throw createZodValidationError(parsedResult.error);
    }
    return parsedResult.data;
}

export function validateDBUserInvitationPartial(data: unknown): z.infer<typeof DBUserInvitationPartialSchema> {
    const parsedResult = DBUserInvitationPartialSchema.safeParse(data);
    if (!parsedResult.success) {
        throw createZodValidationError(parsedResult.error);
    }
    return parsedResult.data;
}