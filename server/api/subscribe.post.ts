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

        // Send transactional email
        const { sendMail } = useNodeMailer()

        await sendMail({ 
            subject: `Explore the Pain Coach demo today`, 
            html: `
                <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Your Exclusive Pain Coach Demo Access</title>
                        <style type="text/css">
                            body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
                            table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
                            img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
                            table { border-collapse: collapse !important; }
                            body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }
                            a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
                            .hero-text { font-family: 'Arial Black', Arial, sans-serif; font-weight: 900; font-size: 48px; color: white; text-transform: uppercase; letter-spacing: 1px; }
                            @media screen and (max-width: 525px) {
                                .wrapper { width: 100% !important; max-width: 100% !important; }
                                .responsive-table { width: 100% !important; }
                                .padding { padding: 10px 5% 15px 5% !important; }
                                .section-padding { padding: 0 15px 50px 15px !important; }
                                .hero-text { font-size: 36px !important; }
                            }
                        </style>
                    </head>
                    <body style="margin: 0 !important; padding: 0 !important; background-color: #f8f9fa;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td align="center" style="padding: 0;" bgcolor="#f8f9fa">
                                    <!-- Hero Banner Section -->
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;" class="responsive-table">
                                        <tr>
                                            <td>
                                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                    <tr>
                                                        <td align="center" style="background-color: #D24646; padding: 50px 20px; background-image: linear-gradient(45deg, #D24646, #ef8e56); border-radius: 10px 10px 0px 0px;">
                                                            <div class="hero-text">
                                                                YOU'RE IN!
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>

                                        <!-- Content Section -->
                                        <tr>
                                            <td bgcolor="#ffffff" style="padding: 32px 16px; border-radius: 0 0 10px 10px;">
                                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                    <tr>
                                                        <td style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #333333; font-size: 32px; font-weight: bold; padding-bottom: 20px;">
                                                            Welcome to Pain Coach
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="padding: 0 0 20px 0; font-size: 16px; line-height: 25px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #666666;">
                                                            Thanks for joining our waitlist! We're excited to offer you an exclusive preview of the Pain Coach app.
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td align="left" style="padding: 20px 0;">
                                                            <table border="0" cellspacing="0" cellpadding="0">
                                                                <tr>
                                                                    <td align="center" style="border-radius: 4px;" bgcolor="#D24646">
                                                                        <a href="https://paincoach.online/demo/${demoToken}" target="_blank" style="font-size: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; padding: 15px 35px; border-radius: 4px; display: inline-block; font-weight: bold;">VIEW DEMO</a>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="padding: 0 0 30px 0; font-size: 14px; line-height: 22px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #666666;">
                                                            If the button above doesn't work, copy and paste this link into your browser:
                                                            <br>
                                                            <a href="https://paincoach.online/demo/${demoToken}" style="color: #D24646;">https://paincoach.online/demo/${demoToken}</a>
                                                        </td>
                                                    </tr>
                                                    <!-- Full Width Image -->
                                                    <tr>
                                                        <td style="padding: 0 0 30px 0;">
                                                            <img src="https://i.imgur.com/FXSLjDh.jpeg" width="100%" style="display: block; border-radius: 4px;" alt="Pain Coach Preview">
                                                        </td>
                                                    </tr>

                                                    <!-- Founder Section -->
                                                    <tr>
                                                        <td style="padding: 40px 0 0 0; border-top: 1px solid #eeeeee;">
                                                            <table border="0" cellspacing="0" cellpadding="0">
                                                                <tr>
                                                                    <td width="60" valign="top">
                                                                        <img src="https://i.imgur.com/U9nTb4e.png" width="50" height="50" style="border-radius: 25px;" alt="Lachlan">
                                                                    </td>
                                                                    <td style="padding: 0 0 0 20px; font-size: 15px; line-height: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #666666;">
                                                                        <strong style="color: #333333;">A note from Lachlan, Founder of Pain Coach</strong><br>
                                                                        I'm thrilled to have you check out a demonstration of our app. We're still hard at work making sure Pain Coach is a valuable tool for managing chronic pain. In the meantime, you can explore the app's interface online using the links above. I can't wait to hear your thoughts!
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>

                                        <!-- Footer Section -->
                                        <tr>
                                            <td align="center" style="padding: 20px 0; font-size: 12px; line-height: 18px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #999999;">
                                                <em>Copyright © 2024 Pain Coach, All rights reserved.</em>
                                                <br>
                                                <a href="https://paincoach.online/user/mailing-list/unsubscribe/${unsubscribeToken}" style="color: #999999; text-decoration: underline; margin-top: 8px; display: inline-block;">Unsubscribe</a>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </body>
                </html>
            `, 
            to: email })

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