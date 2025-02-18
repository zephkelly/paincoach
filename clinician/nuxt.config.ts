// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: { enabled: true },
    future: {
        compatibilityVersion: 4
    },

    modules: ['nuxt-auth-utils'],

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

    devServer: {
        port: 3001
    },
})
