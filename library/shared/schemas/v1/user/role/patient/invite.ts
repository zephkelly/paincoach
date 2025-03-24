import { z } from "zod";
import { DBPatientUserDataSchema } from "@@/shared/schemas/v1/user/role/patient/data";
import { DBBaseUserInvitationDataSchema } from "../../invitation/data/base";


export const DBPatientUserInvitationDataSchema = DBBaseUserInvitationDataSchema.merge(DBPatientUserDataSchema).extend({
    role: z.literal("patient"),
});
export const DBPatientUserInvitationDataPartialSchema = DBPatientUserInvitationDataSchema.partial().extend({
    role: z.literal("patient"),
}); 