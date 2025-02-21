import type { ClinicianUser } from '../users/clinician';
import type { PatientUser } from '../users/patient';
import type { AdminUser } from './admin';



export type User = ClinicianUser | PatientUser | AdminUser;