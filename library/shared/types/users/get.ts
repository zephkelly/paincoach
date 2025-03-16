import type { AdminUser } from "./admin";
import type { ClinicianUser } from "./clinician";
import type { PatientUser } from "./patient";



export interface AdminUserGetResponse {
    users: {
        admin: AdminUser[];
        clinician: ClinicianUser[];
        patient: PatientUser[];
    };
}

export interface ClinicianUserGetResponse {
    users: {
        patient: PatientUser[];
    };
}