import { z } from 'zod';

import { BaseEncryptedPatientMedicationDataSchema } from '.';



export const EncryptedPatientMedicationDataV1Schema = BaseEncryptedPatientMedicationDataSchema.extend({
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