import { z } from 'zod';
import { MedicalRecordSchema } from '../../schemas/record';



export type MedicalRecord = z.infer<typeof MedicalRecordSchema>;