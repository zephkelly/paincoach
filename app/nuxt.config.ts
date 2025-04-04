import { resolve } from 'path'



export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: { enabled: true },
    future: {
        compatibilityVersion: 4
    },

    modules: ['nuxt-auth-utils', '@vite-pwa/nuxt'],

    pwa: {
        registerType: 'autoUpdate',
        manifest: {
            name: 'Pain Coach',
            short_name: 'PainCoach',
            theme_color: '#ffffff',
            icons: [
                {
                    src: 'pwa-192x192.png',
                    sizes: '192x192',
                    type: 'image/png'
                },
                {
                    src: 'pwa-512x512.png',
                    sizes: '512x512',
                    type: 'image/png'
                },
                {
                    src: 'pwa-512x512.png',
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

    ssr: false,

    extends: [
        './../library',
    ],
    alias: {
        '~~lib': resolve(__dirname, '../library'),
        '~lib/types': resolve(__dirname, '../library/shared/types'),
        '~lib/schemas': resolve(__dirname, '../library/shared/schemas'),
        '~lib/utils': resolve(__dirname, '../library/shared/utils'),
    },

    runtimeConfig: {
        databaseConnectionString: process.env.POSTGRES_CONNECTION_STRING,

        // nuxt-auth-utils
        session: {
            name: 'paincoach-session',
            password: process.env.NUXT_SESSION_PASSWORD || '',
            cookie: {
                domain: 'localhost',
                sameSite: 'lax'
            }
        }
    },

    typescript: {
        strict: true
    },

    devServer: {
        port: 3002
    },

    css: [
        '@@/layers/ember/assets/scss/reset.scss',
        '@@/layers/ember/assets/scss/global.scss',
        '@@/layers/ember/assets/scss/globals/index.scss',
        
        '@@/layers/ember/assets/scss/animations.scss',
        '@@/layers/ember/assets/scss/skeleton.scss',
        '@@/layers/ember/assets/scss/transition.scss',
        '@@/layers/ember/assets/scss/theme.scss',
    ]
})