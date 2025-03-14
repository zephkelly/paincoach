import { z } from 'zod';

import { BaseDBUserSchema, BaseUserSchema } from './base';

import { type AdminUser } from '../../types/users/admin';

export const DBAdminUserSchema = BaseDBUserSchema.extend({
    role: z.literal('admin'),
    super_admin: z.boolean(),
})

export const AdminUserSchema = BaseUserSchema.extend({
    role: z.literal('admin'),
    super_admin: z.boolean(),
})

export function safeValidateAdminUser(data: AdminUser) {
    const parsedResult = AdminUserSchema.safeParse(data)

    if (!parsedResult.success) {
        throw new Error(parsedResult.error.errors[0]?.message)
    }

    return parsedResult.data
}