import { z } from "zod";

import { InvitationRoleSchema } from "..";



export const DBBaseUserInvitationDataSchema = z.object({
    role: InvitationRoleSchema,
});