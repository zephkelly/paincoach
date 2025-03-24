import { z } from 'zod';

import {
    DBAdminUserSchema,
    DBAdminUserWithRolesSchema,

    AdminUserSchema,
    AdminUserWithRolesSchema
} from '@@/shared/schemas/v1/user/role/admin';



export type DBAdminUser = z.infer<typeof DBAdminUserSchema>;
export type DBAdminUserWithRoles = z.infer<typeof DBAdminUserWithRolesSchema>;

export type AdminUser = z.infer<typeof AdminUserSchema>;
export type AdminUserWithRoles = z.infer<typeof AdminUserWithRolesSchema>;