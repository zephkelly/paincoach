import { z } from 'zod';
import { UUIDSchema, BigIntSchema } from '../primitives';

import { PhysiotherapyAppRecordV1Schema } from './physiotherapy/app_record/v1';

import { type MedicalRecord } from '../../types/record';



export const RecordPracticeTypeSchema = z.enum([
    'physiotherapy'
]);

export const RecordTypeSchema = z.enum([
    'app_record'
]);
  
export const BaseMedicalRecordSchema = z.object({
    id: BigIntSchema,
    patient_id: UUIDSchema,
    clinician_id: UUIDSchema,
    created_at: z.date(),
    updated_at: z.date()
});

export const MedicalRecordSchema = z.discriminatedUnion('practice_type', [
    PhysiotherapyAppRecordV1Schema,
]);


export const createMedicalRecord = (
    practiceType: z.infer<typeof RecordPracticeTypeSchema>,
    recordType: z.infer<typeof RecordTypeSchema>,
    version: number,
    data: any,
    patientId: string,
    clinicianId: string
): MedicalRecord => {
    const record = {
        id: BigInt(Date.now()),
        patient_id: patientId,
        clinician_id: clinicianId,
        record_practice_type: practiceType,
        record_type: recordType,
        encrypted_record_data: {
            version,
            data,
        },
        created_at: new Date(),
        updated_at: new Date(),
    };
    
    return MedicalRecordSchema.parse(record);
};