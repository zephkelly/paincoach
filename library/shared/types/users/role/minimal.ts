import { z } from 'zod';
import { MinimalRoleSchema } from '@@/shared/schemas/user/role/minimal';



export type MinimalRole = z.infer<typeof MinimalRoleSchema>;