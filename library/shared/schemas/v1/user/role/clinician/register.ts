import { z } from "zod";

import { DBBaseUserRegistrationDataSchema } from "@@/shared/schemas/v1/user/registration/data/base";
import { DBClinicianUserDataSchema } from "./data";



export const DBClinicianUserRegistrationDataSchema = DBBaseUserRegistrationDataSchema.merge(DBClinicianUserDataSchema).extend({
    role: z.literal("clinician"),
});
export const DBClinicianUserRegistrationDataPartialSchema = DBClinicianUserRegistrationDataSchema.partial().extend({
    role: z.literal("clinician"),
});