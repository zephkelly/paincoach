export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: { enabled: false },

    future: {
        compatibilityVersion: 4
    },

    modules: ['nuxt-auth-utils'],

    extends: [
        './../library',
    ],


    css: [
        '~/assets/scss/theme2.scss',
        '~/assets/scss/global.scss',
    ],

    plugins: [
        { src: '~/plugins/register-service-worker.client.ts', mode: 'client' }
    ],

    app: {
        head: {
           link: [
            { rel: 'manifest', href: '/manifest.json' },
           ] 
        }
    },

    runtimeConfig: {
        proxyOrigin: process.env.PROXY_ORIGIN,

        public: {
            dashboardUrl: process.env.DASHBOARD_URL,
        },

        // nuxt-auth-utils
        session: {
            name: 'paincoach-session',
            password: process.env.NUXT_SESSION_PASSWORD || '',
        }
    },

    typescript: {
        strict: true
    },

    devServer: {
        port: 3002
    },
})