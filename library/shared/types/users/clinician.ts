import { z } from 'zod';
import { ClinicianUserSchema } from '../../schemas/users/clinician';



export type ClinicianUser = z.infer<typeof ClinicianUserSchema>;

export function isClinicianUser(user: any): user is ClinicianUser {
    if (user && user.role === 'clinician') {
        return true
    }
    else {
        return false
    };
}