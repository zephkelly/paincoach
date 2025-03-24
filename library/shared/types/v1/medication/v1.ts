import { z } from 'zod';
import { DBEncryptedMedicationDataV1Schema } from "@@/shared/schemas/v1/medication/v1"



export type DBEncryptedMedicationDataV1 = z.infer<typeof DBEncryptedMedicationDataV1Schema>;