import type { z } from 'zod';
import { UserRoleSchema } from '@@/shared/schemas/users';
import type { ClinicianUser } from '../users/clinician';
import type { PatientUser } from '../users/patient';
import type { AdminUser } from './admin';



export type UserRole = z.infer<typeof UserRoleSchema>;

export type User = ClinicianUser | PatientUser | AdminUser;

export type DBUser = Exclude<User, 'role'> & { role_id: string };

export { isAdminUser } from './admin';
export { isClinicianUser } from '../users/clinician';
export { isPatientUser } from '../users/patient';