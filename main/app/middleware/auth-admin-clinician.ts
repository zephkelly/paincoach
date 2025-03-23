export default defineNuxtRouteMiddleware(async (to, from) => {
    const session = useUserSession().session.value;

    if (session && session.user) {
        if (session.user.primary_role !== 'admin' && session.user.primary_role !== 'clinician') {
            return navigateTo('/dashboard/user');
        }
    }
});