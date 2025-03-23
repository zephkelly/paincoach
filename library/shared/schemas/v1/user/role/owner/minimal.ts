import { z } from 'zod';

import { BaseMinimalUserSchema, BaseMinimalUserWithRolesSchema } from '../../minimal';



export const MinimalOwnerUserSchema = BaseMinimalUserSchema.extend({
    primary_role: z.literal('owner').default('owner').optional(),
});

export const MinimalOwnerUserWithRolesSchema = BaseMinimalUserWithRolesSchema.extend({
    primary_role: z.literal('owner').default('owner').optional(),
});