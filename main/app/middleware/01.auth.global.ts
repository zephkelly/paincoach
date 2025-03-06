export default defineNuxtRouteMiddleware(async (to, from) => {
    const session = useUserSession().session.value;
    
    const publicRoutes = ['/', '/dashboard/login', '/dashboard/register', '/dashboard/forgot/password']
    if (publicRoutes.includes(to.path)) {
        if (to.path === '/') {
            if (session && session.user) {
                return navigateTo('/dashboard')
            }
        }

        return;
    }

    if (to.path === '/dashboard') {
        if (!session || !session.user) {
            return navigateTo('/dashboard/login')
        }
    }
});