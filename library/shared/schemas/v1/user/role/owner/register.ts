import { z } from "zod";

import { DBBaseUserRegistrationDataSchema } from "@@/shared/schemas/v1/user/registration/data/base";
import { DBOwnerUserDataSchema } from "./data";



export const DBOwnerUserRegistrationDataSchema = DBBaseUserRegistrationDataSchema.merge(DBOwnerUserDataSchema).extend({
    role: z.literal("owner"),
});
export const DBOwnerUserRegistrationDataPartialSchema = DBOwnerUserRegistrationDataSchema.partial().extend({
    role: z.literal("owner"),
});