import { z } from "zod";
import { BigIntSchema, UUIDSchema } from "../../primitives";




export const RoleSchema = z.enum([
    'owner',
    'admin',
    'clinician',
    'patient',
    'app'
]);

export const AllRolesSchema = z.enum([
    'owner',
    'admin',

    'clinician',
    'patient',

    'app',

    'unregistered'
]);

export const DBRoleSchema = z.object({
    id: BigIntSchema,
    uuid: UUIDSchema,
    name: RoleSchema,
    description: z.string(),
    created_at: z.date(),
    updated_at: z.date(),
})


export const DBUserRoleSchema = z.object({
    user_id: BigIntSchema,
    role_id: BigIntSchema,
    is_primary: z.boolean(),
    created_at: z.date(),
    updated_at: z.date(),
})

export const UserRoleSchema = DBUserRoleSchema.omit({
    created_at: true,
    updated_at: true,
});