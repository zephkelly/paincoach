import { H3Error } from 'h3'
import { DatabaseService } from "../databaseService"



export class MailingListService {
    public static async createMailingListSubscription(email: string): Promise<void> {
        const config = useRuntimeConfig()
        const dc = config.mailchimp.dc
        const listId = config.mailchimp.listId
        const apiKey = config.mailchimp.apiKey

        const db = DatabaseService.getInstance()

        try {
            // Check if email already exists and is active
            const existingSubscription = await db.query(
                `SELECT * FROM "private".mailing_list_subscription 
                 WHERE email = $1 AND is_active = TRUE`,
                [email]
            )

            // If email is already subscribed, return 409 Conflict
            if (existingSubscription.length > 0) {
                throw createError({
                    statusCode: 409,
                    statusText: 'Conflict',
                    message: 'Email is already subscribed.'
                })
            }

            const unsubscribeToken = generateEmailToken(email)

            await db.query(
                `INSERT INTO "private".mailing_list_subscription
                 (email, unsubscribe_token, source, is_active, subscription_date)
                 VALUES ($1, $2, $3, TRUE, CURRENT_TIMESTAMP)
                 ON CONFLICT (email)
                 DO UPDATE SET
                    unsubscribe_token = EXCLUDED.unsubscribe_token,
                    is_active = TRUE,
                    subscription_date = CURRENT_TIMESTAMP,
                    unsubscription_date = NULL,
                    updated_at = CURRENT_TIMESTAMP
                 RETURNING id`,
                [
                    email,
                    unsubscribeToken,
                    'mailing-list-signup',
                ]
            )

            try {
                await $fetch(`https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Basic ${Buffer.from(`any:${apiKey}`).toString('base64')}`
                    },
                    body: {
                        email_address: email,
                        status: 'subscribed',
                        merge_fields: {
                            USUB_TOKEN: unsubscribeToken
                        }
                    }
                })
            }
            catch (error: unknown) {
                throw createError({
                    statusCode: 409,
                    statusText: 'Conflict',
                    message: 'Email is already subscribed.'
                })
            }
        }
        catch (error) {
            console.log('POST /api/v1/mailing-list error:', 'This email attempted to subscribe to mailing-list:', email)

            if (error instanceof H3Error) {
                throw error
            }

            throw createError({
                statusCode: 500,
                message: 'Internal Server Error',
            })
        }
    }
}