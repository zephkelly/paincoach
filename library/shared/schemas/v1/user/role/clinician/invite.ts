import { z } from "zod";

import { DBBaseUserInvitationDataSchema } from "@@/shared/schemas/v1/user/invitation/data/base";
import { DBClinicianUserDataSchema } from "./data";



export const DBClinicianUserInvitationDataSchema = DBBaseUserInvitationDataSchema.merge(DBClinicianUserDataSchema).omit({
    role: true,
}).extend({
    role: z.literal("clinician"),
});

export const DBClinicianUserInvitationDataPartialSchema = DBClinicianUserInvitationDataSchema.partial();