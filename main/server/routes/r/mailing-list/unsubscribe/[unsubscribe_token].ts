import { getEmailHash } from '~~/server/utils/mailing-list/unsubscribe'



export default defineEventHandler(async (event) => {
    const routeParams = getRouterParams(event)
    const { unsubscribe_token } = routeParams
    const nitroApp = useNitroApp()
    //@ts-expect-error
    const client = await nitroApp.database.connect()
    
    try {
        // Update subscription status in the mailing_list_subscription table
        const result = await client.query(
            `UPDATE "private".mailing_list_subscription 
             SET is_active = FALSE, 
                 unsubscription_date = CURRENT_TIMESTAMP, 
                 updated_at = CURRENT_TIMESTAMP 
             WHERE unsubscribe_token = $1 
             RETURNING email`,
            [unsubscribe_token]
        )

        if (result.rowCount === 0) {
            throw createError({
                statusCode: 404,
                statusText: 'Not Found',
                message: 'Subscription not found.',
            })
        }

        const email: string = result.rows[0].email

        // Unsubscribe from Mailchimp
        const config = useRuntimeConfig()
        const dc = config.mailchimpDc
        const listId = config.mailchimpListId
        const apiKey = config.mailchimpApiKey
        const url = `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members/${getEmailHash(email.toLowerCase())}`
        
        const response: any = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${Buffer.from(`any:${apiKey}`).toString('base64')}`
            },
            body: JSON.stringify({
                email_address: email,
                status: 'unsubscribed',
            })
        })

        // Redirect to confirmation page
        return sendRedirect(event, `/mailing-list/unsubscribed/${unsubscribe_token}`, 301)
    }
    catch (error) {
        console.error('Error unsubscribing user:', error)
        throw error
    }
    finally {
        client.release()
    }
})