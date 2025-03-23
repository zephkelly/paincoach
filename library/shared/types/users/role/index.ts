import { z } from 'zod';
import { RoleSchema } from '@@/shared/schemas/user/role';



export type Role = z.infer<typeof RoleSchema>;