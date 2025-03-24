import { z } from "zod";
import { DBAdminUserDataSchema } from "./data";
import { DBBaseUserInvitationDataSchema } from "../../invitation/data/base";


export const DBAdminUserInvitationDataSchema = DBBaseUserInvitationDataSchema.merge(DBAdminUserDataSchema).extend({
    role: z.literal("admin"),
});
export const DBAdminUserInvitationDataPartialSchema = DBAdminUserInvitationDataSchema.partial().extend({
    role: z.literal("admin"),
});