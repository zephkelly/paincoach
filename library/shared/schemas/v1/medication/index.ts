import { z } from 'zod';
import { UUIDSchema, BigIntSchema } from '../../primitives';

import { DBEncryptedMedicationV1Schema } from './v1';



export const DBEncryptedMedicationDataSchema = z.discriminatedUnion('version', [
    DBEncryptedMedicationV1Schema
]);

export const DBEncryptedMedicationDataPartialSchema = z.discriminatedUnion('version', [
    DBEncryptedMedicationV1Schema.partial()
]);

export const DBMedicationSchema = z.object({
    id: BigIntSchema,
    uuid: UUIDSchema,

    patient_id: UUIDSchema,
    clinician_id: UUIDSchema.nullish(),

    encrypted_medication_data: DBEncryptedMedicationDataSchema,

    created_by: UUIDSchema,
    updated_by: UUIDSchema,
    created_at: z.date(),
    updated_at: z.date()
});