import { z } from "zod";

import { BigIntSchema } from "../../primitives";


export const DBMailingListSubscriptionSchema = z.object({
    id: z.number(),
    email: z.string(),
    name: z.string().optional(),
    subscription_date: z.date(),
    unsubscription_date: z.date().optional(),
    is_active: z.boolean().default(true),
    unsubscribe_token: z.string(),
    source: z.string(),
    user_id: BigIntSchema.nullable().optional(),
    created_at: z.date(),
    updated_at: z.date(),
})