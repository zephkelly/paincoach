import * as z from "zod";



export const PainLevelSchema = z.interface({
    level: z.union([
        z.number().min(0).max(10),
        z.literal('missing')
    ]).nullable(),
})