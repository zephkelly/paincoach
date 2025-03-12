export default defineNuxtRouteMiddleware(async (to, from) => {
    const session = useUserSession().session.value;

    if (session && session.user) {
        if (session.user.user_role !== 'admin' && session.user.user_role !== 'clinician') {
            return navigateTo(from.path);
        }
    }
});