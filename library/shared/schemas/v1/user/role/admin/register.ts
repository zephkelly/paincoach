import { z } from "zod";

import { DBBaseUserRegistrationDataSchema } from "@@/shared/schemas/v1/user/registration/data/base";
import { DBAdminUserDataSchema } from "./data";



export const DBAdminUserRegistrationDataSchema = DBBaseUserRegistrationDataSchema.merge(DBAdminUserDataSchema).extend({
    role: z.literal("admin"),
});
export const DBAdminUserRegistrationDataPartialSchema = DBAdminUserRegistrationDataSchema.partial().extend({
    role: z.literal("admin"),
});