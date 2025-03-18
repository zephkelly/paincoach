import { z } from 'zod';

import { MockUserDataSchema } from '@@/shared/schemas/user/mock';



export type MockUserData = z.infer<typeof MockUserDataSchema>;