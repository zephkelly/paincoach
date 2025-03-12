import { z } from 'zod';

import { MockUserDataSchema } from '@@/shared/schemas/users/mock';



export type MockUserData = z.infer<typeof MockUserDataSchema>;