import { z } from "zod";

import { DBClinicianSpecialisations, DBClinicianUserDataSchema } from "./data";
import { DBBaseUserRegistrationDataSchema } from "@@/shared/schemas/v1/user/registration/data/base";




export const DBClinicianUserRegistrationDataSchema = DBBaseUserRegistrationDataSchema.merge(DBClinicianUserDataSchema).extend({
    role: z.literal("clinician"),
    specialisation: z.literal('physiotherapy').default('physiotherapy'),
});
export const DBClinicianUserRegistrationDataPartialSchema = DBClinicianUserRegistrationDataSchema.partial().extend({
    role: z.literal("clinician"),
    specialisation: z.literal('physiotherapy').default('physiotherapy'),
});