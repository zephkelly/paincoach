// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    compatibilityDate: '2024-11-01',

    future: {
        compatibilityVersion: 4
    },

    imports: {
        dirs: [
            'shared/schemas'
        ]
    },
    
    runtimeConfig: {
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
})
