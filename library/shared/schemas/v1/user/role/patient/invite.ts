import { z } from "zod";

import { DBBaseUserInvitationDataSchema } from "@@/shared/schemas/v1/user/invitation/data/base";
import { DBPatientUserDataSchema } from "./data";



export const DBPatientUserInvitationDataSchema = DBBaseUserInvitationDataSchema.merge(DBPatientUserDataSchema).omit({
    role: true,
}).extend({
    role: z.literal("patient"),
});
export const DBPatientUserInvitationDataPartialSchema = DBPatientUserInvitationDataSchema.partial();