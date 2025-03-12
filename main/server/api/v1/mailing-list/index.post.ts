import { DatabaseService } from '~~/server/services/databaseService'
import { generateEmailToken } from '~~/server/utils/mailing-list/unsubscribe'



export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const body = await readBody(event)
    const { email } = body
   
    if (!email || typeof email !== 'string' || !email.includes('@')) {
        throw createError({
            statusCode: 400,
            statusText: 'Bad Request',
            message: 'Invalid email address.',
        })
    }
   
    const dc = config.mailchimp.dc
    const listId = config.mailchimp.listId
    const apiKey = config.mailchimp.apiKey
    
    // Check if the email is already subscribed and active
    const transaction = await DatabaseService.getInstance().createTransaction()
    
    try {
        // Check if email already exists and is active
        const existingSubscription = await transaction.query(
            `SELECT * FROM "private".mailing_list_subscription 
             WHERE email = $1 AND is_active = TRUE`,
            [email]
        )
        
        // If email is already subscribed, return 409 Conflict
        if (existingSubscription.length > 0) {
            await transaction.rollback()
            throw createError({
                statusCode: 409,
                statusText: 'Conflict',
                message: 'Email is already subscribed.'
            })
        }
        
        const unsubscribeToken = generateEmailToken(email)
       
        await transaction.query(
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
                'demo_signup',
            ]
        );
 
        const response = await $fetch(`https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members`, {
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

        
       
        // Send amazon ses transactional email
        await transaction.commit()
        setResponseStatus(event, 201)
    }
    catch (error: any) {
        console.log('Error subscribing user:', error)
        await transaction.rollback();
        
        if (error.statusCode === 409) {
            throw createError({
                statusCode: 409,
                statusText: 'Conflict',
                message: 'Email is already subscribed.'
            })
        }
        
        throw createError({
            statusCode: 500,
            statusText: 'Internal Server Error',
        });
    }
})