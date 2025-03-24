import { z } from 'zod';

import { MinimalUserSchema, MinimalUserWithRolesSchema } from '@@/shared/schemas/v1/user/minimal';



export type MinimalUser = z.infer<typeof MinimalUserSchema>;
export type MinimalUserWithRoles = z.infer<typeof MinimalUserWithRolesSchema>;