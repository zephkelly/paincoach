import { z } from 'zod';
import { DBClinicianUserSchema, ClinicianUserSchema, DBClinicianSpecialisations } from '../../schemas/user/clinician';


export type DBClinicianSpecialisations = z.infer<typeof DBClinicianSpecialisations>;

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