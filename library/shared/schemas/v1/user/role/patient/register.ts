import { z } from "zod";

import { DBBaseUserRegistrationDataSchema } from "@@/shared/schemas/v1/user/registration/data/base";
import { DBPatientUserDataSchema } from "./data";



export const DBPatientUserRegistrationDataSchema = DBBaseUserRegistrationDataSchema.merge(DBPatientUserDataSchema).extend({
    role: z.literal("patient"),
});
export const DBPatientUserRegistrationDataPartialSchema = DBPatientUserRegistrationDataSchema.partial().extend({
    role: z.literal("patient"),
});