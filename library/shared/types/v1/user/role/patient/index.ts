import { z } from 'zod';

import {
    DBPatientUserSchema,
    DBPatientUserWithRolesSchema,

    PatientUserSchema,
    PatientUserWithRolesSchema
} from '@@/shared/schemas/v1/user/role/patient';



export type DBPatientUser = z.infer<typeof DBPatientUserSchema>;
export type DBPatientUserWithRoles = z.infer<typeof DBPatientUserWithRolesSchema>;

export type PatientUser = z.infer<typeof PatientUserSchema>;
export type PatientUserWithRoles = z.infer<typeof PatientUserWithRolesSchema>;