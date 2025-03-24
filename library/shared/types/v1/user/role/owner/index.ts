import { z } from 'zod';

import {
    DBOwnerUserSchema,
    DBOwnerUserWithRolesSchema,

    OwnerUserSchema,
    OwnerUserWithRolesSchema
} from '@@/shared/schemas/v1/user/role/owner';



export type DBOwnerUser = z.infer<typeof DBOwnerUserSchema>;
export type DBOwnerUserWithRoles = z.infer<typeof DBOwnerUserWithRolesSchema>;

export type OwnerUser = z.infer<typeof OwnerUserSchema>;
export type OwnerUserWithRoles = z.infer<typeof OwnerUserWithRolesSchema>;