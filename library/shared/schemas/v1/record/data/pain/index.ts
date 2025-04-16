import * as z from "zod";


export const OneToFiveSchema = z.union([
    z.number().min(1).max(5),
]);

export const ZeroToTenSchema = z.union([
    z.number().min(0).max(10),
]);



export const PainRecordSchema = z.number().min(0).max(10);

export const PsychologicalRecordDataSchema = z.interface({
    mood: OneToFiveSchema,
    stress: OneToFiveSchema,
    anxiety: OneToFiveSchema,
})

export const SleepRecordDataSchema = z.interface({
    duration: z.number().min(0).max(24),
    quality: OneToFiveSchema,
    wake_ups: z.union([
        z.number().min(0).max(9),
        z.literal('10+'),
    ]),
});

export const NutritionRecordDataSchema = z.interface({
    plant_intake: OneToFiveSchema,
    whole_food_intake: OneToFiveSchema,
    sugar_intake: OneToFiveSchema
});

export const ExerciseRecordDataSchema = z.interface({
    duration: z.union([
        z.literal(0),
        z.literal('1-10'),
        z.literal('11-20'),
        z.literal('21-30'),
        z.literal('31+'),
    ]),
    intensity: OneToFiveSchema,
    safety: OneToFiveSchema
});

export const SocialRecordDataSchema = z.interface({
    quality: OneToFiveSchema,
    belonging: OneToFiveSchema,
});



export const DailyRecordDataV1Schema = z.interface({
    pain: PainRecordSchema,
    psychological: PsychologicalRecordDataSchema,
    sleep: SleepRecordDataSchema,
    nutrition: NutritionRecordDataSchema,
    exercise: ExerciseRecordDataSchema,
    social: SocialRecordDataSchema,
});

export const DBDailyRecordDataV1Schema = z.interface({
    version: z.literal(1),
    data: DailyRecordDataV1Schema,
});
