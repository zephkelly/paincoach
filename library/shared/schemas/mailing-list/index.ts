import { z } from "zod";


// CREATE TABLE IF NOT EXISTS private.mailing_list_subscription (
//     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     email TEXT NOT NULL UNIQUE,
//     name TEXT,
//     subscription_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
//     unsubscription_date TIMESTAMPTZ,
//     is_active BOOLEAN DEFAULT TRUE,
//     source TEXT,
//     user_id UUID REFERENCES private.user(id) ON DELETE SET NULL,
//     preferences JSONB DEFAULT '{}',
//     created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
// );

export const DBMailingListSubscriptionSchema = z.object({
    id: z.number(),
    email: z.string(),
    name: z.string().optional(),
    subscription_date: z.date(),
    unsubscription_date: z.date().optional(),
    is_active: z.boolean(),
    unsubscribe_token: z.string(),
    source: z.string(),
    user_id: z.string().optional(),
    preferences: z.record(z.any()).optional(),
    created_at: z.date(),
    updated_at: z.date(),
})