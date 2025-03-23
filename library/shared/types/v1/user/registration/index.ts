import { z } from 'zod';

import {
    UserRegisterSchema,
    UserRegisterPartialSchema,
} from '@@/shared/schemas/v1/user/registration';



export type UserRegister = z.infer<typeof UserRegisterSchema>;
export type UserRegisterPartial = z.infer<typeof UserRegisterPartialSchema>;