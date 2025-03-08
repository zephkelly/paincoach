export default defineEventHandler(async (event) => {
    if (!getRequestURL(event).pathname.startsWith('/api')) {
        return
    }
    if (getRequestURL(event).pathname.startsWith('/api/v1/auth') || getRequestURL(event).pathname.startsWith('/api/v1/webhooks') || getRequestURL(event).pathname.startsWith('/api/v1/mailing-list')) {
        return
    }

    const session = await getUserSession(event)

    try {

        const user_exists = session !== undefined && session.secure !== undefined && session.user !== undefined
        if (user_exists === false) {

            throw createError({
                statusCode: 401,
                statusMessage: 'Forbidden'
            })
        }
    }
    catch (error: any) {
        if (error.statusCode) {
            return sendRedirect(event, '/', 302);
        }

        console.log('MIDDLEWARE auth, session retrieval', error)

        throw createError({
            statusCode: 500,
            statusMessage: 'Internal server error'
        })
    }
});