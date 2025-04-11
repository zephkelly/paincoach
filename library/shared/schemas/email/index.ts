import { z } from "zod";
import type { DBEmailFeedback } from "@@/shared/types/email";



export const DBEmailFeedbackTypeSchema = z.enum(['bounce', 'complaint'])

export const DBEmailFeedbackSchema = z.object({
    feedback_id: z.number(),
    email: z.string(),
    feedback_type: DBEmailFeedbackTypeSchema,
    sub_type: z.string(),
    timestamp: z.date(),
    diagnostic: z.string().optional(),
})

export function validateEmailFeedback(bounce: DBEmailFeedback): DBEmailFeedback {
    const parsedBounce = DBEmailFeedbackSchema.safeParse(bounce)
    if (!parsedBounce.success) {
        throw new Error(`Invalid email feedback: ${parsedBounce.error.errors}`)
    }

    return parsedBounce.data
}