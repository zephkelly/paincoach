import { z } from 'zod';

import {
    DBOwnerUserRegistrationDataSchema,
    DBOwnerUserRegistrationDataPartialSchema
} from '../../role/owner/register';

import {
    DBAdminUserRegistrationDataSchema,
    DBAdminUserRegistrationDataPartialSchema
} from '../../role/admin/register';

import {
    DBClinicianUserRegistrationDataSchema,
    DBClinicianUserRegistrationDataPartialSchema
} from '../../role/clinician/register';

import {
    DBPatientUserRegistrationDataSchema,
    DBPatientUserRegistrationDataPartialSchema
} from '../../role/patient/register';



export const DBUserRegistrationDataSchema = z.discriminatedUnion('role', [
    DBOwnerUserRegistrationDataSchema,
    DBAdminUserRegistrationDataSchema,
    DBClinicianUserRegistrationDataSchema,
    DBPatientUserRegistrationDataSchema
]);

export const DBUserRegistrationDataPartialSchema = z.discriminatedUnion('role', [
    DBOwnerUserRegistrationDataPartialSchema,
    DBAdminUserRegistrationDataPartialSchema,
    DBClinicianUserRegistrationDataPartialSchema,
    DBPatientUserRegistrationDataPartialSchema
]);