import { z } from "zod";

import { DBEncryptedPatientMedicationDataSchema, DBEncryptedPatientMedicationDataPartialSchema } from '@@/shared/schemas/v1/medication/index';



export type DBEncryptedPatientMedicationData = z.infer<typeof DBEncryptedPatientMedicationDataSchema>;
export type DBEncryptedPatientMedicationDataPartial = z.infer<typeof DBEncryptedPatientMedicationDataPartialSchema>;