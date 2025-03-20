import { z } from 'zod';
import { UUIDSchema, BigIntIDSchema } from '../primitives';

import { DBEncryptedPatientMedicationV1Schema } from './v1';



export const DBEncryptedPatientMedicationDataSchema = z.discriminatedUnion('version', [
    DBEncryptedPatientMedicationV1Schema
]);

export const DBEncryptedPatientMedicationDataPartialSchema = z.discriminatedUnion('version', [
    DBEncryptedPatientMedicationV1Schema.partial()
]);

export const DBPatientMedicationSchema = z.object({
    id: BigIntIDSchema,
    patient_id: UUIDSchema,
    clinician_id: UUIDSchema,

    encrypted_medication_data: DBEncryptedPatientMedicationDataSchema,

    created_by: UUIDSchema,
    updated_by: UUIDSchema,
    created_at: z.date(),
    updated_at: z.date()
});