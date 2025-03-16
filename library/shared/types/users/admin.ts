import { z } from 'zod';
import { DBAdminUserSchema, AdminUserSchema } from '../../schemas/users/admin';



export type DBAdminUser = z.infer<typeof DBAdminUserSchema>;
export type AdminUser = z.infer<typeof AdminUserSchema>;

export function isAdminUser(user: any): user is AdminUser {
    if (user && (user.role === 'admin')) {
        return true
    }
    else {
        return false
    };
}