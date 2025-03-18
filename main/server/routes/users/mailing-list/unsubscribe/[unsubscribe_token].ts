export default defineEventHandler((event) => {
    const token = event.context.params?.token
    
    // Redirect to the new route with the token
    return sendRedirect(event, `/r/mailing-list/unsubscribe/${token}`, 301)
})