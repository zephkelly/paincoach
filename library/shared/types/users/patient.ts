import { z } from "zod";
import { DBPatientUserSchema, PatientUserSchema } from "@@/shared/schemas/user/patient/index";



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