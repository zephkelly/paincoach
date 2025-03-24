import { z } from "zod";

import { DBClinicianUserDataSchema } from "./data";
import { DBBaseUserInvitationDataSchema } from "../../invitation/data/base";



export const DBClinicianUserInvitationDataSchema = DBBaseUserInvitationDataSchema.merge(DBClinicianUserDataSchema).extend({
    role: z.literal("clinician"),
});
export const DBClinicianUserInvitationDataPartialSchema = DBClinicianUserInvitationDataSchema.partial().extend({
    role: z.literal("clinician"),
});