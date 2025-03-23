import { z } from "zod";

import { DBBaseUserRegistrationDataSchema } from "@@/shared/schemas/v1/user/registration/data/base";
import { DBAdminUserDataSchema } from "./data";



export const DBAdminUserRegistrationDataSchema = DBBaseUserRegistrationDataSchema.merge(DBAdminUserDataSchema).omit({
    role: true,
}).extend({
    role: z.literal("owner"),
});
export const DBAdminUserRegistrationDataPartialSchema = DBAdminUserRegistrationDataSchema.partial();