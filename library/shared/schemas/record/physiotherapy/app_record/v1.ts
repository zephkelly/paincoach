import { z } from 'zod';
import { PainFactorsPartialSchema } from '@@/shared/schemas/record/physiotherapy/app_record/index';
import { BaseMedicalRecordSchema } from '../..';



export const PhysiotherapyAppRecordEncryptedDataV1Schema = z.object({
    date: z.date(),
    factors: PainFactorsPartialSchema
});

export const PhysiotherapyAppRecordV1Schema = z.object({
    ...BaseMedicalRecordSchema.shape,
    practice_type: z.literal('physiotherapy'),
    record_type: z.literal('app_record'),
    encrypted_record_data: z.object({
        version: z.literal(1),
        data: PhysiotherapyAppRecordEncryptedDataV1Schema,
    })
});