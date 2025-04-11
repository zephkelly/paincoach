export default defineEventHandler( async (event) => {
    const proxyOrigin = useRuntimeConfig().proxyOrigin;

    const target = proxyOrigin + event.path;

    return proxyRequest(event, target);
});