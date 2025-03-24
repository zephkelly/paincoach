import { z } from 'zod';

import {
    DBBaseUserSchema,
    BaseUserSchema,
    
    DBBaseUserWithRolesSchema,
    BaseUserWithRolesSchema
} from '@@/shared/schemas/v1/user/base';

import { DBOwnerUserDataSchema } from './data';



export const DBOwnerUserSchema = DBBaseUserSchema.merge(DBOwnerUserDataSchema).extend({
    primary_role: z.literal('owner'),
});

export const DBOwnerUserWithRolesSchema = DBBaseUserWithRolesSchema.merge(DBOwnerUserDataSchema).extend({
    primary_role: z.literal('owner'),
});


export const OwnerUserSchema = BaseUserSchema.merge(DBOwnerUserDataSchema).extend({
    primary_role: z.literal('owner'),
});

export const OwnerUserWithRolesSchema = BaseUserWithRolesSchema.merge(DBOwnerUserDataSchema).extend({
    primary_role: z.literal('owner'),
});