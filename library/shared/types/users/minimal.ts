import { z } from 'zod'
import { MininmalUserInfoSchema } from '@@/shared/schemas/users/minimal'



export type MinimalUserInfo = z.infer<typeof MininmalUserInfoSchema>;