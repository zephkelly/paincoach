import { z } from "zod";
import {
    DBAdminUserSchema,
    AdminUserSchema,

    DBAdminProfileDataSchema,
    DBAdminProfileDataPartialSchema,

    AdminProfileDataSchema,
} from "@@/shared/schemas/user/admin/index";



export type DBAdminProfileData = z.infer<typeof DBAdminProfileDataSchema>;
export type DBAdminProfileDataPartial = z.infer<typeof DBAdminProfileDataPartialSchema>;

export type AdminProfileData = z.infer<typeof AdminProfileDataSchema>;

export type DBAdminUser = z.infer<typeof DBAdminUserSchema>;
export type AdminUser = z.infer<typeof AdminUserSchema>;


export function isAdminUser(user: any): user is AdminUser {
    if (user && user.role === 'admin') {
        return true
    }
    else {
        return false
    };
}