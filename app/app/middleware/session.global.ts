export default defineNuxtRouteMiddleware((to, from) => {
    const { loggedIn, session } = useAuth();
    const config = useRuntimeConfig();

    if (!loggedIn.value || !session.value) {
        console.log('User is not logged in, redirecting to login page');
        return navigateTo(config.proxyOrigin + '/dashboard/login', { external: true });
    }

    if (!session.value.user?.roles.includes('app')) {
        console.log('User is logged in and has app role, allowing access');
        return navigateTo(config.proxyOrigin + '/dashboard/login', { external: true });
    }

    
    console.log('User is logged in and has app role, allowing access');
})