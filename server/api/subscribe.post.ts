import { type User } from '@/types/user'
import { createUser } from '@/server/utils/database/user'

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

    const dc = config.mailchimpDc
    const listId = config.mailchimpListId
    const apiKey = config.mailchimpApiKey
    const transactionalApiKey = config.mailchimpTransactionalApiKey
    
    try {
        const demoToken = generateHexToken(10)
        const unsubscribeToken = generateHexToken(18)
        
        // Add user to database first
        const newUser: User = {
            email,
            unsubscribe_token: unsubscribeToken,
            demo_token: demoToken,
            demo_visit_count: 0
        }
        
        await createUser(newUser);
        
        // Subscribe user to mailchimp list
        const url = `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members`

        const response: any = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${Buffer.from(`any:${apiKey}`).toString('base64')}`
            },
            body: JSON.stringify({
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    DEMO_TOKEN: demoToken,
                    USUB_TOKEN: unsubscribeToken
                }
            })
        })

        const transactionalResponse = await sendTemplateEmail(email, transactionalApiKey, unsubscribeToken, demoToken)
        console.log('Transactional API Response:', transactionalResponse)

        setResponseStatus(event, 201)
        return {
            statusCode: 201,
            statusText: 'Created',
            message: 'User subscribed to Pain Coach demo.',
            data: {
                success: true,
            }
        }
    }
    catch (error: any) {
        console.log('Error:', error)
        throw error
    }
})

function generateHexToken(length: number): string {
    const characters = '0123456789ABCDEF'
    let result = ''
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
}

async function sendTemplateEmail(email: string, transactionKey: string, unsubscribeToken: string, demoToken: string) {
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
                    subject: "Explore the Pain Coach demo today",
                    from_email: 'no-reply@paincoach.online',
                    from_name: 'Lachlan Townend',
                    merge_vars: [{
                        rcpt: email,
                        vars: [{
                            name: 'DEMO_TOKEN',
                            content: demoToken
                        }, {
                            name: 'USUB_TOKEN',
                            content: unsubscribeToken
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
