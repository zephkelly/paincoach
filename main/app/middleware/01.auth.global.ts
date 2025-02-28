import { type UserSession } from "#auth-utils";



export default defineNuxtRouteMiddleware(async (to, from) => {
    const publicRoutes = ['/', '/app/login', '/app/register', '/app/forgot/password']
    if (publicRoutes.includes(to.path)) {

        if (to.path === '/app/login' || to.path === '/app/register') {
            const session = useUserSession().session.value;
            if (session && session.user) {
                return navigateTo('/app')
            }
        }

        return
    }

    const session = useUserSession().session.value;
  
    if (!session || !session.user) {
      return navigateTo('/app/login')
    }
});