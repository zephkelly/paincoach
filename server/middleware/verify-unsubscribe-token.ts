import { H3Event, getRouterParams, sendRedirect } from 'h3'
import { checkUnsubscribeTokenExists } from '~/server/utils/database/user'

export default defineEventHandler(async (event: H3Event) => {
    try {
        const path = event.node.req.url || ''

        if (!path.includes('/mailing-list/unsubscribed/') || !path.includes('/mailing-list/resubscribe/')) {
            return
        }
    
        const unsubscribe_token = path.split('/mailing-list/unsubscribed/')[1]

        if (!unsubscribe_token || unsubscribe_token === '') {
            console.log('Redirecting: No token')
            return sendRedirect(event, '/', 302)
        }
        
        const unsubscribeTokenExists = await checkUnsubscribeTokenExists(unsubscribe_token)

        if (!unsubscribeTokenExists) {
            console.log('Redirecting: Invalid token')
            return sendRedirect(event, '/', 302)
        }
    }
    catch (error) {
        console.error('Error verifying demo token:', error)
        return sendRedirect(event, '/', 302)
    }
})