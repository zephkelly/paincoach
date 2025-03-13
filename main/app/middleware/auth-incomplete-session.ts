import { type IncompleteUser } from "#auth-utils";



export default defineNuxtRouteMiddleware(async (to, from) => {
    const { session, loggedIn, clear, fetch } = await useUserSession();

    if (!loggedIn.value || !session.value) {
        console.log('No session found, redirecting to login');
        return navigateTo('/dashboard/login');
    }

    if (session.value.user) {
        if (session.value.user.user_role) {
            if (session.value.user.user_role === 'admin') {
                return;
            }

            return navigateTo('/dashboard');
        }       
    }

    const typedSession: IncompleteUser = session.value.user as any as IncompleteUser;

    if (!typedSession.registration_data) {
        await clear();
        return navigateTo('/dashboard');
    }
});