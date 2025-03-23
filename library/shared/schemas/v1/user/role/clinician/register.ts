import { z } from "zod";

import { DBBaseUserRegistrationDataSchema } from "@@/shared/schemas/v1/user/registration/data/base";
import { DBClinicianUserDataSchema } from "./data";



export const DBClinicianUserRegistrationDataSchema = DBBaseUserRegistrationDataSchema.merge(DBClinicianUserDataSchema).omit({
    role: true,
}).extend({
    role: z.literal("owner"),
});
export const DBClinicianUserRegistrationDataPartialSchema = DBClinicianUserRegistrationDataSchema.partial();