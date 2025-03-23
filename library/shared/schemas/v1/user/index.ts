import { z } from "zod";

import {
    DBOwnerUserSchema,
    DBOwnerUserWithRolesSchema
} from "@@/shared/schemas/v1/user/role/owner";

import {
    DBAdminUserSchema,
    DBAdminUserWithRolesSchema
} from "@@/shared/schemas/v1/user/role/admin";

import {
    DBClinicianUserSchema,
    DBClinicianUserWithRolesSchema
} from "@@/shared/schemas/v1/user/role/clinician";

import {
    DBPatientUserSchema,
    DBPatientUserWithRolesSchema
} from "@@/shared/schemas/v1/user/role/patient";


export const DBUserSchema = z.discriminatedUnion('primary_role', [
    DBOwnerUserSchema,
    DBAdminUserSchema,
    DBClinicianUserSchema,
    DBPatientUserSchema
]);

export const DBUserWithRolesSchema = z.discriminatedUnion('primary_role', [
    DBOwnerUserWithRolesSchema,
    DBAdminUserWithRolesSchema,
    DBClinicianUserWithRolesSchema,
    DBPatientUserWithRolesSchema
]);