import { z } from 'zod';

import { DBBaseUserSchema, DBBaseUserWithRolesSchema } from '@@/shared/schemas/v1/user/base';
import { DBClinicianUserDataSchema } from './data';



export const DBClinicianUserSchema = DBBaseUserSchema.merge(DBClinicianUserDataSchema).extend({
    primary_role: z.literal('clinician').default('clinician').optional(),
});

export const DBClinicianUserWithRolesSchema = DBBaseUserWithRolesSchema.merge(DBClinicianUserDataSchema).extend({
    primary_role: z.literal('clinician').default('clinician').optional(),
});