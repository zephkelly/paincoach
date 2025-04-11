import { z } from 'zod';

import {
    DBBaseUserSchema,
    BaseUserSchema,
    
    DBBaseUserWithRolesSchema,
    BaseUserWithRolesSchema
} from '@@/shared/schemas/v1/user/base';

import { DBAdminUserDataSchema } from './data';



export const DBAdminUserSchema = DBBaseUserSchema.merge(DBAdminUserDataSchema).extend({
    primary_role: z.literal('admin'),
});

export const DBAdminUserWithRolesSchema = DBBaseUserWithRolesSchema.merge(DBAdminUserDataSchema).extend({
    primary_role: z.literal('admin'),
});



export const AdminUserSchema = BaseUserSchema.merge(DBAdminUserDataSchema).extend({
    primary_role: z.literal('admin'),
});

export const AdminUserWithRolesSchema = BaseUserWithRolesSchema.merge(DBAdminUserDataSchema).extend({
    primary_role: z.literal('admin'),
});