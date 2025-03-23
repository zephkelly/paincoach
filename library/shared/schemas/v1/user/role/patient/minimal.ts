import { z } from 'zod';

import { BaseMinimalUserSchema, BaseMinimalUserWithRolesSchema } from '../../minimal';



export const MinimalPatientUserSchema = BaseMinimalUserSchema.extend({
    primary_role: z.literal('patient').default('patient').optional(),
});

export const MinimalPatientUserWithRolesSchema = BaseMinimalUserWithRolesSchema.extend({
    primary_role: z.literal('patient').default('patient').optional(),
});