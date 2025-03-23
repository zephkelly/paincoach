import { z } from "zod";
import { DBEncryptedPatientMedicationDataV1Schema, DBEncryptedPatientMedicationDataV1PartialSchema } from '@@/shared/schemas/v1/medication/v1';


export type DBEncryptedPatientMedicationDataV1 = z.infer<typeof DBEncryptedPatientMedicationDataV1Schema>;
export type DBEncryptedPatientMedicationDataV1Partial = z.infer<typeof DBEncryptedPatientMedicationDataV1PartialSchema>;