// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'path'



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

    css: [
        '~/assets/scss/animations.scss',
        '~/assets/scss/reset.scss',
        '~/assets/scss/global.scss',
    ],

    extends: [
        './../library',
    ],

    alias: {
        '~~lib': resolve(__dirname, '../library'),
        '~lib/types': resolve(__dirname, '../library/shared/types'),
        '~lib/schemas': resolve(__dirname, '../library/shared/schemas'),
        '~lib/utils': resolve(__dirname, '../library/shared/utils'),
    },
    app: {
        head: {
            meta: [
                { charset: 'utf-8' },
                // @ts-ignore
                { description: 'Pain Coach - Your personalised pain and lifestyle assistant. Find your clarity.' },
                {
                    hid: 'og:image',
                    property: 'og:image',
                    content: 'https://www.paincoach.online/images/og-image.png',
                },
                {
                    hid: 'og:url',
                    property: 'og:url',
                    content: 'https://www.paincoach.online',
                },
                {
                    hid: 'og:title',
                    property: 'og:title',
                    content: 'Pain Coach - Find your Clarity',
                },
                {
                    hid: 'og:description',
                    property: 'og:description',
                    content: 'Your personalised pain and lifestyle assistant.',
                },
                {
                    hid: 'og:type',
                    property: 'og:type',
                    content: 'website',
                },
            ],
            htmlAttrs: { lang: 'en', },
        }
    },

    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    api: 'modern-compiler',
                },
            },
        },
    },

    typescript: {
        strict: true
    },
})
