export default defineNuxtRouteMiddleware((to, from) => {
    const { loggedIn, session } = useAuth();
    const config = useRuntimeConfig();

    if (!loggedIn.value) {
        return navigateTo(config.apiOrigin, { external: true });
    }
  })