import { z } from 'zod';
import { PermissionSchema } from '@@/shared/schemas/v1/permission';


export type Permission = z.infer<typeof PermissionSchema>;