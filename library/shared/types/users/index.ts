import type { z } from 'zod';
import { UserStatusSchema, UserRoleSchema } from '@@/shared/schemas/users';
import type { DBClinicianUser, ClinicianUser } from '../users/clinician';
import type { DBPatientUser, PatientUser } from '../users/patient';
import type { DBAdminUser, AdminUser } from './admin';



export type UserStatus = z.infer<typeof UserStatusSchema>;
export type UserRole = z.infer<typeof UserRoleSchema>;

export type User = ClinicianUser | PatientUser | AdminUser;
export type DBUser = DBClinicianUser | DBPatientUser | DBAdminUser;

export type {
    DBClinicianUser,
    ClinicianUser,
    DBPatientUser,
    PatientUser,
    DBAdminUser,
    AdminUser
};

export { isAdminUser } from './admin';
export { isClinicianUser } from '../users/clinician';
export { isPatientUser } from '../users/patient';