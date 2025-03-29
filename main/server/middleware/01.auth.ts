export default defineEventHandler(async (event) => {
        if (!getRequestURL(event).pathname.startsWith('/api')) {
            return
        }
        if (getRequestURL(event).pathname.startsWith('/api/v1/auth') || getRequestURL(event).pathname.startsWith('/api/v1/webhooks') || getRequestURL(event).pathname.startsWith('/api/v1/mailing-list')) {
            return
        }
        
        try {
            await onRequestValidateSession(event, true)
        }
        catch(error: any) {
            if (error.statusCode) {
                return sendRedirect(event, '/', 302);
            }

            throw createError({
                statusCode: 500,
                statusMessage: 'Internal server error'
            })
        }
    }
);