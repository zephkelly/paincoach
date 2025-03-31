import { z } from "zod";
import { DBPatientUserRegistrationDataSchema } from "@@/shared/schemas/v1/user/role/patient/register";



export type DBPatientUserRegistrationData = z.infer<typeof DBPatientUserRegistrationDataSchema>;