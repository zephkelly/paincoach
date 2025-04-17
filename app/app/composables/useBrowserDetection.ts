export const useBrowserDetection = () => {
    const isFirefox = ref(false);
    
    if (import.meta.browser) {
        const userAgent = navigator.userAgent.toLowerCase();
        isFirefox.value = userAgent.includes('firefox') || userAgent.includes('fxios');
    }
    else if (import.meta.server) {
        const nuxtApp = useNuxtApp();
        const headers = nuxtApp.ssrContext?.event.node.req.headers || {};
        const userAgent = headers['user-agent']?.toLowerCase() || '';
        isFirefox.value = userAgent.includes('firefox') || userAgent.includes('fxios');
    }
    
    return {
        isFirefox
    };
};