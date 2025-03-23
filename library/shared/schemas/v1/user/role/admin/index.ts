import { z } from 'zod';

import { DBBaseUserSchema, DBBaseUserWithRolesSchema } from '@@/shared/schemas/v1/user/base';



export const DBAdminUserSchema = DBBaseUserSchema.extend({
    primary_role: z.literal('admin'),
});

export const DBAdminUserWithRolesSchema = DBBaseUserWithRolesSchema.extend({
    primary_role: z.literal('admin'),
});