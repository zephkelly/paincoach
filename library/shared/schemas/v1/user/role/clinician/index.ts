import { z } from 'zod';

import {
    DBBaseUserSchema,
    BaseUserSchema,
    
    DBBaseUserWithRolesSchema,
    BaseUserWithRolesSchema
} from '@@/shared/schemas/v1/user/base';

import { DBClinicianUserDataSchema } from './data';



export const DBClinicianUserSchema = DBBaseUserSchema.merge(DBClinicianUserDataSchema).extend({
    primary_role: z.literal('clinician'),
});

export const DBClinicianUserWithRolesSchema = DBBaseUserWithRolesSchema.merge(DBClinicianUserDataSchema).extend({
    primary_role: z.literal('clinician'),
});


export const ClinicianUserSchema = BaseUserSchema.merge(DBClinicianUserDataSchema).extend({
    primary_role: z.literal('clinician'),
});

export const ClinicianUserWithRolesSchema = BaseUserWithRolesSchema.merge(DBClinicianUserDataSchema).extend({
    primary_role: z.literal('clinician'),
});