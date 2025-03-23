import { z } from 'zod';

import { DBBaseUserSchema, DBBaseUserWithRolesSchema } from '@@/shared/schemas/v1/user/base';
import { DBPatientUserDataSchema } from './data';



export const DBPatientUserSchema = DBBaseUserSchema.merge(DBPatientUserDataSchema).extend({
    primary_role: z.literal('patient').default('patient').optional(),
});

export const DBPatientUserWithRolesSchema = DBBaseUserWithRolesSchema.merge(DBPatientUserDataSchema).extend({
    primary_role: z.literal('patient').default('patient').optional(),
});