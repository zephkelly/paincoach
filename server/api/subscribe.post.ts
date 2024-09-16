export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const body = await readBody(event)
    const { email } = body

    const dc = config.mailchimpDc
    const listId = config.mailchimpListId
    const apiKey = config.mailchimpApiKey

    const url = `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members`

    try {
        const response = await $fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `apikey ${apiKey}`
            },
            body: JSON.stringify({
                email_address: email,
                status: 'subscribed'
            })
        })

        return { success: true }
    } catch (error: any) {
        console.error('Mailchimp API Error:', error)
        return { 
            success: false, 
            error: error + 'An error occurred while subscribing.'
        }
    }
})