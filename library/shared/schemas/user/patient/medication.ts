import { z } from 'zod';
import { UUIDSchema, BigIntIDSchema } from '../../primitives';


export const EncryptedPatientMedicationDataSchema = z.object({
    data: z.object({
        start_date: z.date(),
        end_date: z.date().nullable(),
        is_on_going: z.boolean(),

        medication_name: z.string(),
        dosage: z.string(),
        frequency: z.string(),
    }),
    version: z.number().int(),
});


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
