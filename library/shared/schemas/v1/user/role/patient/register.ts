import { z } from "zod";

import { DBBaseUserRegistrationDataSchema } from "@@/shared/schemas/v1/user/registration/data/base";
import { DBPatientUserDataSchema } from "./data";



export const DBPatientUserRegistrationDataSchema = DBBaseUserRegistrationDataSchema.merge(DBPatientUserDataSchema).omit({
    role: true,
}).extend({
    role: z.literal("owner"),
});
export const DBPatientUserRegistrationDataPartialSchema = DBPatientUserRegistrationDataSchema.partial();