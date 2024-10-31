import { type User } from '@/types/user'
import { createUser } from '@/server/utils/database/user'
import { mergeProps } from 'vue'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const body = await readBody(event)
    const { email } = body

    if (!email) {
        setResponseStatus(event, 400)
        return {
            success: false,
            error: 'Email address is required.'
        }
    }

    if (!email.includes('@')) {
        setResponseStatus(event, 400)
        return {
            success: false,
            error: 'Invalid email address.'
        }
    }

    if (typeof email !== 'string') {
        setResponseStatus(event, 400)
        return {
            success: false,
            error: 'Invalid email address.'
        }
    }

    const dc = config.mailchimpDc
    const listId = config.mailchimpListId
    const apiKey = config.mailchimpApiKey
    const transactionalApiKey = config.mailchimpTransactionalApiKey

    const url = `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members`

    try {
        const demoToken = generateHexToken(10)

        const response: any = await $fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${Buffer.from(`any:${apiKey}`).toString('base64')}`
            },
            body: JSON.stringify({
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    DEMO_TOKEN: demoToken
                }
            })
        })

        const newUser: User = {
            email,
            demoToken,
            demoVisitCount: 0
        }

        await createUser(newUser);

        // const transactionalResponse = await sendTemplateEmail(email, transactionalApiKey, demoToken)

        return { 
            success: true,
            // transactionalResponse
        }
    }
    catch (error: any) {
        setResponseStatus(event, error.response?.status || 500)

        if (error.response._data) {
            return {
                success: false,
                error: error.response._data.title ? error.response._data.title : 'An error occurred while processing your request.'
            }
        }

        return {
            success: false,
            error: 'An error occurred while processing your request.'
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
                    subject: "You're in! Explore your Pain Coach demo today",
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

function generateHexToken(length: number): string {
    const characters = '0123456789ABCDEF'
    let result = ''
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
}