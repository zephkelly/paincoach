import { z } from 'zod';

import { UUIDSchema, BigIntSchema } from "@@/shared/schemas/primitives";

import { DBBaseUserWithRolesSchema } from "@@/shared/schemas/v1/user/base";

import { DBUserRegistrationDataSchema, DBUserRegistrationDataPartialSchema } from "@@/shared/schemas/v1/user/registration/data";

import { CreateEncryptedPainMedicationDataV1RequestSchema, CreateEncryptedPainMedicationDataV1RequestPartialSchema } from "@@/shared/schemas/v1/medication/v1";
import { createSchemaValidator } from '@@/layers/ember/utils/validator';



export const UserRegisterSchema = DBBaseUserWithRolesSchema.pick({
    primary_role: true,
    roles: true,

    email: true,
    phone_number: true,
    profile_url: true,

    first_name: true,
    last_name: true,
    title: true,

    data_sharing_enabled: true,
}).extend({
    public_id: UUIDSchema,

    password: z.string().min(1, 'Password is required')
        .max(255, 'Password must be less than 255 characters'),
    confirm_password: z.string().min(1, 'Confirm password is required')
        .max(255, 'Confirm password must be less than 255 characters'),

    invitation_token: UUIDSchema,

    will_use_app: z.boolean(),
    medications: z.array(CreateEncryptedPainMedicationDataV1RequestSchema).min(1).nullable().optional(),

    role_data: z.array(DBUserRegistrationDataSchema).min(1),
});

export const UserRegisterStrictSchema = UserRegisterSchema.refine((data) => {
    return data.password === data.confirm_password;
}, {
    message: 'Passwords do not match',
});

export const UserRegisterPartialSchema = UserRegisterSchema.partial().extend({
    medications: z.array(CreateEncryptedPainMedicationDataV1RequestPartialSchema).min(1).nullable().optional(),
    role_data: z.array(DBUserRegistrationDataPartialSchema).min(1),
})

export const userRegisterValidator = createSchemaValidator(UserRegisterSchema);

export const userRegisterStrictValidator = createSchemaValidator(UserRegisterStrictSchema);
