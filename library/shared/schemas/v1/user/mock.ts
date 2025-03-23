import { z } from 'zod';

import { RoleSchema } from '@@/shared/schemas/v1/role';
import { UUIDSchema } from '@@/shared/schemas/primitives';



export const MockUserDataSchema = z.object({
    uuid: UUIDSchema,
    role: RoleSchema,
});