import { boolean, z } from 'zod';
import { BaseDBUserSchema } from './base';
import { DBAdminUserFieldsSchema } from './admin';
import { DBClinicianUserFieldsSchema } from './clinician';
import { DBPatientUserFieldsSchema } from './patient';

import { createZodValidationError } from '@@/shared/utils/zod/error';

import { type BaseDBMininmalUser } from '@@/shared/types/users/minimal';


export const BaseDBMininmalUserSchema = BaseDBUserSchema.pick({
    id: true,
    role: true,
    email: true,
    status: true,
    profile_url: true,
    first_name: true,
    last_name: true,
    created_at: true,
})

export const DBMinimalAdminUserSchema = BaseDBMininmalUserSchema.merge(DBAdminUserFieldsSchema)

export const DBMinimalClinicianUserSchema = BaseDBMininmalUserSchema.merge(DBClinicianUserFieldsSchema)

export const DBMinimalPatientUserSchema = BaseDBMininmalUserSchema.merge(DBPatientUserFieldsSchema)

export const DBMinimalUserSchema = z.discriminatedUnion('role', [
    DBMinimalAdminUserSchema,
    DBMinimalClinicianUserSchema,
    DBMinimalPatientUserSchema
])




// export function validateMinimalUserInfo(data: any) {
//     const parsedResult = BaseBDMininmalUserSchema.safeParse(data)

//     if (!parsedResult.success) {
//         throw createZodValidationError(parsedResult.error)
//     }

//     return parsedResult.data
// }

export function validateBaseDBMinimalUser(data: BaseDBMininmalUser): BaseDBMininmalUser {
    const parsedResult = BaseDBMininmalUserSchema.safeParse(data)

    if (!parsedResult.success) {
        throw createZodValidationError(parsedResult.error)
    }

    return parsedResult.data
}