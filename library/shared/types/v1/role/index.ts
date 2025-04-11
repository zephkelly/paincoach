import { z } from "zod";

import { AllRolesSchema, RoleSchema } from "@@/shared/schemas/v1/role";


export type AllRoles = z.infer<typeof AllRolesSchema>;
export type Role = z.infer<typeof RoleSchema>;