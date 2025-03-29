import { z } from 'zod';

import { DBBaseUserSchema } from '../../base';

import {
    DBOwnerUserInvitationDataSchema,
    DBOwnerUserInvitationDataPartialSchema,
} from '@@/shared/schemas/v1/user/role/owner/invite';

import {
    DBAdminUserInvitationDataSchema,
    DBAdminUserInvitationDataPartialSchema,
} from '@@/shared/schemas/v1/user/role/admin/invite';

import {
    DBClinicianUserInvitationDataSchema,
    DBClinicianUserInvitationDataPartialSchema,
} from '@@/shared/schemas/v1/user/role/clinician/invite';

import {
    DBPatientUserInvitationDataSchema,
    DBPatientUserInvitationDataPartialSchema,
} from '@@/shared/schemas/v1/user/role/patient/invite';




export const DBUserInvitationRoleDataSchema = z.discriminatedUnion('role', [
    DBOwnerUserInvitationDataSchema,
    DBAdminUserInvitationDataSchema,
    DBClinicianUserInvitationDataSchema,
    DBPatientUserInvitationDataSchema
]);

export const DBUserRoleInvitationRoleDataPartialSchema = z.discriminatedUnion('role', [
    DBOwnerUserInvitationDataPartialSchema,
    DBAdminUserInvitationDataPartialSchema,
    DBClinicianUserInvitationDataPartialSchema,
    DBPatientUserInvitationDataPartialSchema
]);

export const DBUserInvitationDataSchema = z.object({
    ...DBBaseUserSchema.pick({
        first_name: true,
        last_name: true,
        // title: true,
        profile_url: true,
        data_sharing_enabled: true
    }).shape,
    role_data: z.array(DBUserInvitationRoleDataSchema).min(1).optional()
});

export const DBUserInvitationDataPartialSchema = z.object({
    ...DBBaseUserSchema.pick({
        first_name: true,
        last_name: true,
        // title: true,
        profile_url: true,
        data_sharing_enabled: true
    }).partial().shape,
    role_data: z.array(DBUserRoleInvitationRoleDataPartialSchema).min(1).optional()
});