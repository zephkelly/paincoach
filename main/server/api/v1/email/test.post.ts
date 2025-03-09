import { EmailService } from "~~/server/services/emailService";


export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    const {
        email
    } = body;

    if (!email || email === '') {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
            message: 'Email is required',
        });
    }

    try {
        const emailService = EmailService.getInstance();

        const response = await emailService.sendAdminInvitationEmail(email, '1234', 'Evan');

        console.log('response', response);

        return;
    }
    catch (error) {
        console.error('error', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
            message: 'Error sending email',
        });
    }
});