import type { OwnerUserWithRoles } from "../role/owner";
import type { AdminUserWithRoles } from "../role/admin";
import type { ClinicianUserWithRoles } from "../role/clinician";
import type { PatientUserWithRoles } from "../role/patient";



export interface AllUsersGetResponse {
    users: {
        owner: OwnerUserWithRoles[];
        admin: AdminUserWithRoles[];
        clinician: ClinicianUserWithRoles[];
        patient: PatientUserWithRoles[];
    };
}

export interface PatientsUserGetResponse {
    users: {
        patient: PatientUserWithRoles[];
    };
}