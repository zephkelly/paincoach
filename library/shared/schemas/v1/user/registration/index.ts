import { z } from 'zod';
import { createZodValidationError } from '@@/shared/utils/zod/error';

import { UUIDSchema, BigIntSchema } from "@@/shared/schemas/primitives";

import { DBBaseUserWithRolesSchema } from "@@/shared/schemas/v1/user/base";

import { DBUserRegistrationDataSchema } from "@@/shared/schemas/v1/user/registration/data";

import { DBEncryptedMedicationDataV1Schema } from "@@/shared/schemas/v1/medication/v1";



export const UserRegisterSchema = DBBaseUserWithRolesSchema.pick({
    primary_role: true,
    roles: true, // This will represent the roles that the user has opted into during registration (will always be registered as their primary role)

    email: true,
    phone_number: true,
    profile_url: true,

    first_name: true,
    last_name: true,
    title: true,

    data_sharing_enabled: true,    
}).extend({
    id: BigIntSchema,
    user_uuid: UUIDSchema,

    invitation_token: UUIDSchema,

    confirm_email: z.string().email(),

    password: z.string(),
    confirm_password: z.string(),

    medications: z.array(DBEncryptedMedicationDataV1Schema).min(1).nullable().optional(),

    role_data: z.array(DBUserRegistrationDataSchema).min(1),
    will_use_app: z.boolean().default(true),
});

export const UserRegisterPartialSchema = UserRegisterSchema.partial()

export function validateUserRegister(data: unknown): z.infer<typeof UserRegisterSchema> {
    const parsedResult = UserRegisterSchema.safeParse(data);
    if (!parsedResult.success) {
        throw createZodValidationError(parsedResult.error);
    }
    return parsedResult.data;
}

export function validateUserRegisterPartial(data: unknown): z.infer<typeof UserRegisterPartialSchema> {
    const parsedResult = UserRegisterPartialSchema.safeParse(data);
    if (!parsedResult.success) {
        throw createZodValidationError(parsedResult.error);
    }
    return parsedResult.data;
}