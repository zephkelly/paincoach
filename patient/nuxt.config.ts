import { resolve } from 'path'



export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: { enabled: true },
    future: {
        compatibilityVersion: 4
    },

    modules: ['nuxt-auth-utils', '@vite-pwa/nuxt'],

    pwa: {

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
})