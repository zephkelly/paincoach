import { z } from 'zod';

import { DBBaseUserSchema, DBBaseUserWithRolesSchema } from '@@/shared/schemas/v1/user/base';



export const DBOwnerUserSchema = DBBaseUserSchema.extend({
    primary_role: z.literal('owner'),
});

export const DBOwnerUserWithRolesSchema = DBBaseUserWithRolesSchema.extend({
    primary_role: z.literal('owner'),
});