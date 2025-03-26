import { z } from 'zod';
import { DBEncryptedMedicationDataV1Schema, CreateEncryptedPainMedicationDataV1RequestSchema, CreateEncryptedPainMedicationDataV1RequestPartialSchema } from "@@/shared/schemas/v1/medication/v1"



export type DBEncryptedMedicationDataV1 = z.infer<typeof DBEncryptedMedicationDataV1Schema>;

export type CreateEncryptedPainMedicationDataV1Request = z.infer<typeof CreateEncryptedPainMedicationDataV1RequestSchema>;
export type CreateEncryptedPainMedicationDataV1RequestPartial = z.infer<typeof CreateEncryptedPainMedicationDataV1RequestPartialSchema>;