import { z } from 'zod';
import { UserRegisterSchema, UserRegisterPartialSchema } from '@@/shared/schemas/user/register';



export type UserRegister = z.infer<typeof UserRegisterSchema>;
export type UserRegisterPartial = z.infer<typeof UserRegisterPartialSchema>;