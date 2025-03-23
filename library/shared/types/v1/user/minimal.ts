import { z } from 'zod';

import { MinimalUserSchema } from '@@/shared/schemas/v1/user/minimal';



export type MinimalUser = z.infer<typeof MinimalUserSchema>;