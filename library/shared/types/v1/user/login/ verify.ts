import { z } from 'zod';
import { UserLoginVerificationDataSchema } from '@@/shared/schemas/v1/user/login/verify';



export type UserLoginVerificationData = z.infer<typeof UserLoginVerificationDataSchema>;