import * as z from "zod";
import { UUIDSchema } from "../../primitives";



export const OneToFiveSchema = z.union([
    z.number().min(1).max(5),
]);

export const ZeroToTenSchema = z.union([
    z.number().min(0).max(10),
]);


export const DBPainDailyRecord = z.interface({
    id: UUIDSchema,
    date: z.date(),
    created_at: z.date(),
    updated_at: z.date(),
    user_id: UUIDSchema,
    version: z.literal(1),

    pain_level: ZeroToTenSchema,
    
    // Psychological data
    mood_level: OneToFiveSchema,
    stress_level: OneToFiveSchema,
    anxiety_level: OneToFiveSchema,
    
    // Sleep data
    sleep_duration: z.number().min(0).max(24),
    sleep_quality: OneToFiveSchema,
    sleep_wake_ups: z.union([
        z.number().min(0).max(9),
        z.literal('10+'),
    ]),
    
    // Nutrition data
    plant_intake_level: OneToFiveSchema,
    whole_food_intake_level: OneToFiveSchema,
    sugar_intake_level: OneToFiveSchema,
    
    // Exercise data
    exercise_duration: z.union([
        z.literal('0'),
        z.literal('1-10'),
        z.literal('11-20'),
        z.literal('21-30'),
        z.literal('31+'),
    ]),
    exercise_intensity: OneToFiveSchema,
    exercise_safety: OneToFiveSchema,
    
    // Social data
    social_quality: OneToFiveSchema,
    social_belonging: OneToFiveSchema,

    notes: z.string().max(500).optional(),
})