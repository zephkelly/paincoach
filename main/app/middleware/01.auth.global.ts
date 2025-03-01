import { type UserSession } from "#auth-utils";



export default defineNuxtRouteMiddleware(async (to, from) => {
    const session = useUserSession().session.value;
    
    const publicRoutes = ['/', '/app/login', '/app/register', '/app/forgot/password']
    if (publicRoutes.includes(to.path)) {
        if (to.path === '/') {
            if (session && session.user) {
                return navigateTo('/app')
            }
        }

        return;
    }

    if (to.path === '/app') {
        if (!session || !session.user) {
            return navigateTo('/app/login')
        }
    }
});