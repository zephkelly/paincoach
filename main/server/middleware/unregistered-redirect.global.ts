import { H3Event } from 'h3'
import { getUserSessionContext } from '~~/server/utils/auth/session/getSession'



export default defineEventHandler(async (event: H3Event) => {
    const path = event.node.req.url
    
    if (path?.includes('/api')) return;
    
    const { session } = await getUserSessionContext(event)

    if (!session?.secure) return;
    if (session.secure?.id) return;

    if (path !== '/dashboard/user/invite') {
        console.log('Redirecting to /dashboard/user/invite')
        return sendRedirect(event, '/dashboard/user/invite')
    }
})