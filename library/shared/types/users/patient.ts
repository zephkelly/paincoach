import { z } from "zod";
import { PatientUserSchema } from "../../schemas/users/patient";



export type PatientUser = z.infer<typeof PatientUserSchema>;

export function isPatientUser(user: any): user is PatientUser {
    if (user && user.role === 'clinician') {
        return true
    }
    else {
        return false
    };
}