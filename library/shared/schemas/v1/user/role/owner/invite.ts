import { z } from "zod";

import { DBBaseUserInvitationDataSchema } from "@@/shared/schemas/v1/user/invitation/data/base";
import { DBOwnerUserDataSchema } from "./data";



export const DBOwnerUserInvitationDataSchema = DBBaseUserInvitationDataSchema.merge(DBOwnerUserDataSchema).omit({
    role: true,
}).extend({
    role: z.literal("owner"),
});;
export const DBOwnerUserInvitationDataPartialSchema = DBOwnerUserInvitationDataSchema.partial();