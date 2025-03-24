import { z } from "zod";
import { DBOwnerUserDataSchema } from "./data";
import { DBBaseUserInvitationDataSchema } from "../../invitation/data/base";



export const DBOwnerUserInvitationDataSchema = DBBaseUserInvitationDataSchema.merge(DBOwnerUserDataSchema).extend({
    role: z.literal("owner"),
});
export const DBOwnerUserInvitationDataPartialSchema = DBOwnerUserInvitationDataSchema.partial().extend({
    role: z.literal("owner"),
});