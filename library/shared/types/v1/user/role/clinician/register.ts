import { z } from "zod";
import { DBClinicianUserRegistrationDataSchema } from "@@/shared/schemas/v1/user/role/clinician/register";



export type DBClinicianUserRegistrationData = z.infer<typeof DBClinicianUserRegistrationDataSchema>;