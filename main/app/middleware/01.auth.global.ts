export default defineNuxtRouteMiddleware(async (to, from) => {
    const { session } = useUserSession();

    const publicRoutes = ['/', '/dashboard/login', '/dashboard/register', '/dashboard/forgot/password']
    if (publicRoutes.includes(to.path)) {
        if (to.path === '/') {
            if (session.value && session.value.user) {
                if (session.value.user?.primary_role === 'unregistered') {
                    return navigateTo('/dashboard/user/invite')
                }
                else {
                    return navigateTo('/dashboard')
                }
            }
        }

        return;
    }

    if (to.path.includes('/dashboard')) {
        if (!session.value || !session.value.user && to.path !== '/dashboard/login') {
            return navigateTo('/dashboard/login')
        }

        if (session.value.invitation_data && to.path !== '/dashboard/user/invite') {
            return navigateTo('/dashboard/user/invite')
        }
    }
});