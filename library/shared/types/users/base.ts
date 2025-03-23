import { z } from 'zod';
import { BaseUserSchema, BaseUserWithRolesSchema, BaseUserWithRolesPartialSchema } from '@@/shared/schemas/user/base';



export type BaseUser = z.infer<typeof BaseUserSchema>;

export type BaseUserWithRoles = z.infer<typeof BaseUserWithRolesSchema>;
export type BaseUserWithRolesPartial = z.infer<typeof BaseUserWithRolesPartialSchema>;