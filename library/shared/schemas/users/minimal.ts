import { z } from 'zod';
import { BaseDBUserSchema } from './base';


import { createZodValidationError } from '@@/shared/utils/zod/error';


export const MininmalUserInfoSchema = BaseDBUserSchema.pick({
    id: true,
    role: true,
    email: true,
    profile_url: true,
    first_name: true,
    last_name: true,
    verified: true
})

export function validateMinimalUserInfo(data: any) {
    const parsedResult = MininmalUserInfoSchema.safeParse(data)

    if (!parsedResult.success) {
        throw createZodValidationError(parsedResult.error)
    }

    return parsedResult.data
}