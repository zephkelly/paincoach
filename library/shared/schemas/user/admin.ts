import { z } from 'zod';

import { BaseDBUserSchema, BaseUserSchema } from './base';

import { type AdminUser } from '../../types/users/admin';



export const DBAdminUserFieldsSchema = z.object({
    role: z.literal('admin'),
    owner: z.literal(false).default(false),
})

export const DBAdminUserSchema = BaseDBUserSchema.merge(DBAdminUserFieldsSchema);

export const AdminUserSchema = BaseUserSchema.merge(DBAdminUserFieldsSchema);


export function safeValidateAdminUser(data: AdminUser) {
    const parsedResult = AdminUserSchema.safeParse(data)

    if (!parsedResult.success) {
        throw new Error(parsedResult.error.errors[0]?.message)
    }

    return parsedResult.data
}