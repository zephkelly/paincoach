import { z } from 'zod';
import { UUIDSchema, BigIntIDSchema } from '../primitives';

import { EncryptedPatientMedicationDataV1Schema } from './v1';



export const EncryptedPatientMedicationDataSchema = z.discriminatedUnion('version', [
    EncryptedPatientMedicationDataV1Schema
]);

export const PatientMedicationSchema = z.object({
    id: BigIntIDSchema,
    patient_id: UUIDSchema,
    clinician_id: UUIDSchema,

    encrypted_medication_data: EncryptedPatientMedicationDataSchema,

    created_by: UUIDSchema,
    updated_by: UUIDSchema,
    created_at: z.date(),
    updated_at: z.date()
});
