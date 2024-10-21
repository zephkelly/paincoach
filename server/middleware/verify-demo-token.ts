import { H3Event, getRouterParams, sendRedirect } from 'h3'

export default defineEventHandler((event: H3Event) => {
    const testToken = 'test'
    const url = event.node.req.url || ''

    if (!url.startsWith('/demo/')) {
        return
    }

    const urlParts = url.split('/')
    const token = urlParts[2]

    if (url === '/' || url === '') {
        return
    }

    if (!token || token === '') {
        console.log('Redirecting: No token')
        return sendRedirect(event, '/', 302)
    }

    if (token !== testToken) {
        console.log('Redirecting: Invalid token')
        return sendRedirect(event, '/', 302)
    }

    if (url.startsWith(`/demo/${token}`)) {
        console.log('valid route')
        return
    }

    console.log('Redirecting: Catch-all')
    return sendRedirect(event, '/', 302)
})