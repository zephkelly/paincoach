import { z } from "zod";

import { RoleSchema } from "../../../role";



export const DBBaseUserInvitationDataSchema = z.object({
    role: RoleSchema,
});