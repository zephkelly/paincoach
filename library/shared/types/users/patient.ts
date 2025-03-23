import { z } from "zod";
import {
    DBPatientUserFieldsSchema,
    DBPatientUserFieldsPartialSchema,

    DBPatientUserSchema,
    PatientUserSchema
} from "@@/shared/schemas/user/patient/index";



export type DBPatientUserFields = z.infer<typeof DBPatientUserFieldsSchema>;
export type DBPatientUserFieldsPartial = z.infer<typeof DBPatientUserFieldsPartialSchema>;

export type DBPatientUser = z.infer<typeof DBPatientUserSchema>;
export type PatientUser = z.infer<typeof PatientUserSchema>;

export function isPatientUser(user: any): user is PatientUser {
    if (user && user.role === 'clinician') {
        return true
    }
    else {
        return false
    };
}