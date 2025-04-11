import { z } from "zod";

import {
    DBPatientUserDataSchema,
    DBPatientUserDataPartialSchema
} from "@@/shared/schemas/v1/user/role/patient/data";


export type DBPatientUserData = z.infer<typeof DBPatientUserDataSchema>;
export type DBPatientUserDataPartial = z.infer<typeof DBPatientUserDataPartialSchema>;