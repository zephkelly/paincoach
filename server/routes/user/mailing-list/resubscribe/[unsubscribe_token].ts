import { getEmailHash } from "~/server/utils/emailHash";

export default defineEventHandler(async (event) => {
    // const { unsubscribe_token } = event.pathParameters;
    const routeParams = getRouterParams(event);
    const { unsubscribe_token } = routeParams;

    const nitroApp = useNitroApp();
    //@ts-expect-error
    const client = await nitroApp.database.connect();

    try {
        // Unsubscribe from database and return email
        const result = await client.query('UPDATE "private".users SET mailing_list = true WHERE unsubscribe_token = $1 RETURNING email', [unsubscribe_token]);

        if (result.rowCount === 0) {
            throw createError({
                statusCode: 404,
                statusText: 'Not Found',
                message: 'User not found.',
            });
        }

        const email: string = result.rows[0].email;

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
                status: 'subscribed',
            })
        })

        return sendRedirect(event, `/`, 301)
    }
    catch (error) {
        console.error('Error unsubscribing user:', error);
        throw error;
    }
    finally {
        client.release();
    }
})