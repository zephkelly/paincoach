import { z } from 'zod';

import { 
    DBOwnerUserInvitationDataSchema,
    DBOwnerUserInvitationDataPartialSchema
} from "../../role/owner/invite";

import { 
    DBAdminUserInvitationDataSchema,
    DBAdminUserInvitationDataPartialSchema
} from "../../role/admin/invite";

import { 
    DBClinicianUserInvitationDataSchema,
    DBClinicianUserInvitationDataPartialSchema
} from "../../role/clinician/invite";

import { 
    DBPatientUserInvitationDataSchema,
    DBPatientUserInvitationDataPartialSchema
} from "../../role/patient/invite";



export const DBUserInvitationDataSchema = z.discriminatedUnion('role', [
    DBOwnerUserInvitationDataSchema,
    DBAdminUserInvitationDataSchema,
    DBClinicianUserInvitationDataSchema,
    DBPatientUserInvitationDataSchema
]);

export const DBUserInvitationDataPartialSchema = z.discriminatedUnion('role', [
    DBOwnerUserInvitationDataPartialSchema,
    DBAdminUserInvitationDataPartialSchema,
    DBClinicianUserInvitationDataPartialSchema,
    DBPatientUserInvitationDataPartialSchema
]);