import { resolve } from 'path'



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

    alias: {
        '@': resolve(__dirname, './app'),
        '@@': resolve(__dirname, './')
    },
    
    runtimeConfig: {
        databaseConnectionString: process.env.POSTGRES_CONNECTION_STRING,
        
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
