export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const body = await readBody(event)
    const { email } = body

    const dc = config.mailchimpDc
    const listId = config.mailchimpListId
    const apiKey = config.mailchimpApiKey
    const transactionalApiKey = config.mailchimpTransactionalApiKey

    const url = `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members`

    try {
        const response = await $fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`
            },
            body: JSON.stringify({
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    DEMO_TOKEN: 'test'
                }
            })
        })

        const transactionalResponse = await sendTemplateEmail(email, transactionalApiKey, 'test')

        return { 
            success: true,
            response,
            transactionalResponse
        }
    } catch (error: any) {
        setResponseStatus(event, error.response?.status || 500)
        return {
            success: false,
            error: error + 'An error occurred while processing your request.'
        }
    }
})

async function sendTemplateEmail(email: string, transactionKey: string, demoToken: string) {
    const url = 'https://mandrillapp.com/api/1.0/messages/send-template.json'
    
    try {
        const response = await $fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                key: transactionKey,
                template_name: 'pain-coach-demo-link',
                template_content: [],
                merge_language: 'MailChimp',
                message: {
                    to: [{ email }],
                    subject: 'Welcome to our newsletter!',
                    from_email: 'admin@paincoach.online',
                    from_name: 'Lachlan Townend',
                    merge_vars: [{
                        rcpt: email,
                        vars: [{
                            name: 'DEMO_TOKEN',
                            content: demoToken
                        }]
                    }]
                },
            })
        })
        return response
    } catch (error: any) {
        console.error('Transactional API Error:', error)
        throw error
    }
}
