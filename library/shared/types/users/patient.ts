import { z } from "zod";
import { DBPatientUserSchema, PatientUserSchema } from "../../schemas/users/patient";



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