import { z } from 'zod'
import { BaseDBMininmalUserSchema, DBMinimalUserSchema } from '@@/shared/schemas/user/minimal'



export type BaseDBMininmalUser = z.infer<typeof BaseDBMininmalUserSchema>;
export type DBMinimalUser = z.infer<typeof DBMinimalUserSchema>;