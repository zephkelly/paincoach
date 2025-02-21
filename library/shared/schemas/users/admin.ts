import { z } from 'zod';
import { BaseUserSchema } from './base';



export const AdminUserSchema = BaseUserSchema.extend({
    role: z.literal('admin'),
})

export function safeValidateAdminUser(data: any) {
    const parsedResult = AdminUserSchema.safeParse(data)

    if (!parsedResult.success) {
        throw new Error(parsedResult.error.errors[0].message)
    }

    return parsedResult.data
}