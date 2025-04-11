export default defineNuxtRouteMiddleware((to, from) => {
    const { loggedIn, session } = useAuth();
    const config = useRuntimeConfig();

    if (!loggedIn.value) {
        console.log('User is not logged in, redirecting to login page');
        return navigateTo(config.proxyOrigin + '/dashboard/login', { external: true });
    }
})