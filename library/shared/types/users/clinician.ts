import { z } from 'zod';
import { DBClinicianUserSchema, ClinicianUserSchema } from '../../schemas/users/clinician';



export type DBClinicianUser = z.infer<typeof DBClinicianUserSchema>;
export type ClinicianUser = z.infer<typeof ClinicianUserSchema>;

export function isClinicianUser(user: any): user is ClinicianUser {
    if (user && user.role === 'clinician') {
        return true
    }
    else {
        return false
    };
}