import { z } from 'zod';

import { BaseMinimalUserSchema, BaseMinimalUserWithRolesSchema } from '../../minimal';



export const MinimalClinicianUserSchema = BaseMinimalUserSchema.extend({
    primary_role: z.literal('clinician').default('clinician').optional(),
});

export const MinimalClinicianUserWithRolesSchema = BaseMinimalUserWithRolesSchema.extend({
    primary_role: z.literal('clinician').default('clinician').optional(),
});