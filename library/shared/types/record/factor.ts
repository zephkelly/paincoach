import { z } from 'zod';

import {
    PainFactorTypeSchema,
    PainFactorsSchema,
    PainFactorsPartialSchema,
    PainFactorsRecordSchema,
} from '../../schemas/record/factor';



export type PainFactorType = z.infer<typeof PainFactorTypeSchema>;

export type PainFactors = z.infer<typeof PainFactorsSchema>;
export type PainFactorsPartial = z.infer<typeof PainFactorsPartialSchema>;

export type PainFactorsRecord = z.infer<typeof PainFactorsRecordSchema>;
