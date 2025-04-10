export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: { enabled: false },

    future: {
        compatibilityVersion: 4
    },

    modules: ['nuxt-auth-utils', '@vite-pwa/nuxt'],

    pwa: {
        registerType: 'autoUpdate',
        manifest: {
            name: 'Pain Coach',
            short_name: 'PainCoach',
            description: 'Pain Coach is a digital health platform that helps you manage your pain.',
            theme_color: '#ffffff',
            icons: [
                {
                    src: '180.png',
                    sizes: '180x180',
                    type: 'image/png'
                },
                {
                    src: '192.png',
                    sizes: '192x192',
                    type: 'image/png'
                },
                {
                    src: '256.png',
                    sizes: '256x256',
                    type: 'image/png'
                },
                {
                    src: '512.png',
                    sizes: '512x512',
                    type: 'image/png'
                },
                {
                    src: '512.png',
                    sizes: '512x512',
                    type: 'image/png',
                    purpose: 'any maskable'
                }
            ],
            start_url: '/',
            display: 'standalone',
            background_color: '#ffffff'
        },
    },

    extends: [
        './../library',
    ],


    css: [
        '~/assets/scss/theme2.scss',
        '~/assets/scss/global.scss',
    ],

    // alias: {
    //     '~~lib': resolve(__dirname, '../library'),
    //     '~lib/types': resolve(__dirname, '../library/shared/types'),
    //     '~lib/schemas': resolve(__dirname, '../library/shared/schemas'),
    //     '~lib/utils': resolve(__dirname, '../library/shared/utils'),
    // },

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