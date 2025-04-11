import { H3Error } from 'h3'
import { MailingListService } from '~~/server/services/mailing-list'



export default defineEventHandler(async (event) => {
    try {
        const { email } = await readBody(event)
    
        if (!email || typeof email !== 'string' || !email.includes('@')) {
            throw createError({
                statusCode: 400,
                statusText: 'Bad Request',
                message: 'Invalid email address.',
            })
        }

        await MailingListService.createMailingListSubscription(email)
    
        setResponseStatus(event, 201)
    }
    catch (error: unknown) {
        if (error instanceof H3Error) {
            throw error;
        }

        if (error instanceof Error) {
            throw createError({
                statusCode: 500,
                message: error.message,
            });
        }

        console.error('Error creating invitation:', error);
        throw createError({
            statusCode: 500,
            message: 'Internal Server Error',
        });
    }
})