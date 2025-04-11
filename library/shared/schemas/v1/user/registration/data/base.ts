import { z } from "zod";

import { RoleSchema } from "../../../role";



export const DBBaseUserRegistrationDataSchema = z.object({
    role: RoleSchema,
});