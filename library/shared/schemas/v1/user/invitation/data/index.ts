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

export const DBBaseInvitationUserDataSchema = DBBaseUserSchema.pick({
    first_name: true,
    last_name: true,
    title: true,
    profile_url: true,
    data_sharing_enabled: true
});

export const DBBaseInvitationUserDataPartialSchema = DBBaseInvitationUserDataSchema.partial();


export const DBUserInvitationDataSchema = z.object({
    ...DBBaseInvitationUserDataSchema.shape,
    role_data: z.array(DBUserInvitationRoleDataSchema).min(1).optional()
});

export const DBUserInvitationDataPartialSchema = DBBaseInvitationUserDataPartialSchema.extend({
    role_data: z.array(DBUserInvitationRoleDataSchema).optional()
});