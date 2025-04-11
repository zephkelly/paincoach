import { z } from 'zod';

import {
    DBBaseUserSchema,
    BaseUserSchema,
    
    DBBaseUserWithRolesSchema,
    BaseUserWithRolesSchema
} from '@@/shared/schemas/v1/user/base';

import { DBPatientUserDataSchema } from './data';



export const DBPatientUserSchema = DBBaseUserSchema.merge(DBPatientUserDataSchema).extend({
    primary_role: z.literal('patient'),
});

export const DBPatientUserWithRolesSchema = DBBaseUserWithRolesSchema.merge(DBPatientUserDataSchema).extend({
    primary_role: z.literal('patient'),
});


export const PatientUserSchema = BaseUserSchema.merge(DBPatientUserDataSchema).extend({
    primary_role: z.literal('patient'),
});

export const PatientUserWithRolesSchema = BaseUserWithRolesSchema.merge(DBPatientUserDataSchema).extend({
    primary_role: z.literal('patient'),
});