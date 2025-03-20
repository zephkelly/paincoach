import { z } from "zod";

import { DBEncryptedPatientMedicationDataSchema, DBEncryptedPatientMedicationDataPartialSchema } from '@@/shared/schemas/medication/index';



export type DBEncryptedPatientMedicationData = z.infer<typeof DBEncryptedPatientMedicationDataSchema>;
export type DBEncryptedPatientMedicationDataPartial = z.infer<typeof DBEncryptedPatientMedicationDataPartialSchema>;