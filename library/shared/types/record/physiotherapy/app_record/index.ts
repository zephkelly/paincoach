import { z } from 'zod';

import {
    PainFactorTypeSchema,
    PainFactorRatingSchema,

    PainFactorsSchema,
    PainFactorsPartialSchema,
    PainFactorsRecordSchema,
} from '@@/shared/schemas/record/app_record';



export type PainFactorType = z.infer<typeof PainFactorTypeSchema>;

export type PainFactorRating = z.infer<typeof PainFactorRatingSchema>;

export type PainFactors = z.infer<typeof PainFactorsSchema>;
export type PainFactorsPartial = z.infer<typeof PainFactorsPartialSchema>;

export type PainFactorsRecord = z.infer<typeof PainFactorsRecordSchema>;
