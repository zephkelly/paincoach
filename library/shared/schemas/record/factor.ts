import { z } from 'zod';

import {
    type PainFactors,
    type PainFactorsPartial
} from '../../types/record/factor';



export const PainFactorTypeSchema = z.enum(['psychological distress', 'sleep', 'exercise', 'nutrition', 'social connection']);

const PainFactorRating = z.number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5");

export const PainFactorsSchema = z.object({
    psychological_distress: PainFactorRating,
    sleep: PainFactorRating,
    exercise: PainFactorRating,
    nutrition: PainFactorRating,
    social_connection: PainFactorRating
});

export const PainFactorsPartialSchema = PainFactorsSchema.partial();

export const PainFactorsRecordSchema = z.object({
    date: z.date(),
    factors: PainFactorsPartialSchema
});


export function safeValidatePainFactors(data: PainFactors) {
    const parsedResult = PainFactorsSchema.safeParse(data)

    if (!parsedResult.success) {
        throw new Error(parsedResult.error.errors[0].message)
    }
}

export function safeValidatePainFactorsRecord(data: PainFactorsPartial) {
    const parsedResult = PainFactorsRecordSchema.safeParse(data)

    if (!parsedResult.success) {
        throw new Error(parsedResult.error.errors[0].message)
    }

    return parsedResult.data
}