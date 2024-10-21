import { H3Event, getRouterParams, sendRedirect } from 'h3'
import { checkUserByDemoToken } from '@/server/utils/database/user'
import { incrementDemoViewCount } from '@/server/utils/database/user'

export default defineEventHandler(async (event: H3Event) => {
    console.log('Verifying demo token')
    try {
        const url = event.node.req.url || ''
        if (!url.startsWith('/demo/')) {
            return
        }
        
        const urlParts = url.split('/')
        const token = urlParts[2]

        if (!token || token === '') {
            console.log('Redirecting: No token')
            return sendRedirect(event, '/', 302)
        }

        if (!url.startsWith(`/demo/${token}`)) {
            console.log('Redirecting: URL mismatch')
            return sendRedirect(event, '/', 302)
        }

        const userExists = await checkUserByDemoToken(token)

        if (!userExists) {
            console.log('Redirecting: Invalid token')
            return sendRedirect(event, '/', 302)
        }

        console.log('Valid token, allowing access to demo')
        await incrementDemoViewCount(token)
    }
    catch (error) {
        console.error('Error verifying demo token:', error)
        return sendRedirect(event, '/', 302)
    }
})