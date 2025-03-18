import { z } from 'zod';



export const EncryptedPatientMedicationDataV1Schema = z.object({
    version: z.literal(1),
    data: z.object({
        start_date: z.date(),
        end_date: z.date().nullable(),
        is_on_going: z.boolean(),
        
        medication_name: z.string(),
        dosage: z.string(),
        frequency: z.string(),
    })
});