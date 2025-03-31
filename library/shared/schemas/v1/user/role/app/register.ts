import { z } from "zod";

import { DBBaseUserRegistrationDataSchema } from "@@/shared/schemas/v1/user/registration/data/base";



export const DBAppUserRegistrationDataSchema = DBBaseUserRegistrationDataSchema.extend({
    role: z.literal("app"),
});

export const DBAppUserRegistrationDataPartialSchema = DBBaseUserRegistrationDataSchema.partial().extend({
    role: z.literal("app"),
});