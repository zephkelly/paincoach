import { z } from 'zod';

import { LimitedUserSchema, LimitedUserWithRolesSchema } from '@@/shared/schemas/v1/user/limited';



export type LimitedUser = z.infer<typeof LimitedUserSchema>;
export type LimitedUserWithRoles = z.infer<typeof LimitedUserWithRolesSchema>;