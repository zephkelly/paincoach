import { z } from 'zod';

import {
    DBUserSchema,
    DBUserWithRolesSchema,

    UserSchema,
    UserWithRolesSchema,
} from '@@/shared/schemas/v1/user';



export type DBUser = z.infer<typeof DBUserSchema>;
export type DBUserWithRoles = z.infer<typeof DBUserWithRolesSchema>;

export type User = z.infer<typeof UserSchema>;
export type UserWithRoles = z.infer<typeof UserWithRolesSchema>;