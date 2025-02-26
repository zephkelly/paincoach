import { z } from 'zod';

import { BaseUserSchema } from './base';

import { type AdminUser } from '../../types/users/admin';


export const AdminUserSchema = BaseUserSchema.extend({
    role: z.literal('admin'),
})

export function safeValidateAdminUser(data: AdminUser) {
    const parsedResult = AdminUserSchema.safeParse(data)

    if (!parsedResult.success) {
        throw new Error(parsedResult.error.errors[0]?.message)
    }

    return parsedResult.data
}