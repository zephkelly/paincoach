import { type UserSession } from "#auth-utils";



export default defineNuxtRouteMiddleware(async (to, from) => {
    const publicRoutes = ['/', '/login', '/register', '/forgot/password']
    if (publicRoutes.includes(to.path)) {
        return
    }

    const session = useUserSession().session.value;
  
    if (!session || !session.user) {
      return navigateTo('/')
    }
});