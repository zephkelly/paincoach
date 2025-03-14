export default defineNuxtRouteMiddleware(async (to, from) => {
    const { session, loggedIn} = await useUserSession();

    if (!loggedIn.value || !session.value) {
        console.log('No session found, redirecting to login');
        return navigateTo('/dashboard/login');
    }

    if (session.value.user) {
        if (session.value.user.user_role) {
            if (session.value.user.user_role === 'admin') {
                return;
            }

            if (session.value.user.user_role === 'incomplete_user') {
                return;
            }

            return navigateTo('/dashboard');
        }       
    }
});