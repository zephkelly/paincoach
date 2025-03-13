export default defineNuxtRouteMiddleware(async (to, from) => {
    const { session } = useUserSession();

    const publicRoutes = ['/', '/dashboard/login', '/dashboard/register', '/dashboard/forgot/password']
    if (publicRoutes.includes(to.path)) {
        if (to.path === '/') {
            if (session.value && session.value.user) {
                return navigateTo('/dashboard')
            }
        }

        return;
    }

    if (to.path.includes('/dashboard')) {
        if (!session.value || !session.value.user) {
            return navigateTo('/dashboard/login')
        }
    }
});