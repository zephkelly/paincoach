import { z } from "zod";

import { DBBaseUserInvitationDataSchema } from "@@/shared/schemas/v1/user/invitation/data/base";
import { DBAdminUserDataSchema } from "./data";



export const DBAdminUserInvitationDataSchema = DBBaseUserInvitationDataSchema.merge(DBAdminUserDataSchema).omit({
    role: true,
}).extend({
    role: z.literal("patient"),
});
export const DBAdminUserInvitationDataPartialSchema = DBBaseUserInvitationDataSchema.partial();