import { z } from 'zod';

import { UserRoleSchema } from './base';



export const MockUserDataSchema = z.object({
    id: z.string().uuid(),
    role: UserRoleSchema,
});