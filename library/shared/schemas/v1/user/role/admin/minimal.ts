import { z } from 'zod';

import { BaseMinimalUserSchema, BaseMinimalUserWithRolesSchema } from '../../minimal';



export const MinimalAdminUserSchema = BaseMinimalUserSchema.extend({
    primary_role: z.literal('admin').default('admin').optional(),
});

export const MinimalAdminUserWithRolesSchema = BaseMinimalUserWithRolesSchema.extend({
    primary_role: z.literal('admin').default('admin').optional(),
});