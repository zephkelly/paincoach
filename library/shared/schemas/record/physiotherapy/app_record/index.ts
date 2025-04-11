import { z } from 'zod';

import {
    type PainFactors,
} from '@@/shared/types/record/physiotherapy/app_record';



export const PainFactorTypeSchema = z.enum(['psychological distress', 'sleep', 'exercise', 'nutrition', 'social connection']);

export const PainFactorRatingSchema = z.number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5");

export const PainFactorsSchema = z.object({
    psychological_distress: PainFactorRatingSchema,
    sleep: PainFactorRatingSchema,
    exercise: PainFactorRatingSchema,
    nutrition: PainFactorRatingSchema,
    social_connection: PainFactorRatingSchema
});

export const PainFactorsPartialSchema = PainFactorsSchema.partial();

export function validatePhysiotherapyAppRecord(data: PainFactors) {
    const parsedResult = PainFactorsSchema.safeParse(data)

    if (!parsedResult.success) {
        throw new Error(parsedResult.error.errors[0]?.message)
    }
}