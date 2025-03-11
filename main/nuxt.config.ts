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
        environmentDomain: process.env.ENVIRONMENT_DOMAIN,

        // nuxt-auth-utils
        session: {
            name: 'paincoach-session',
            password: process.env.NUXT_SESSION_PASSWORD || '',
            cookie: {
                domain: 'localhost',
                sameSite: 'lax'
            }
        },

        mailchimp: {
            dc: process.env.MAILCHIMP_DC,
            listId: process.env.MAILCHIMP_LIST_ID,
            apiKey: process.env.MAILCHIMP_API_KEY,
            transactionalApiKey: process.env.MAILCHIMP_TRANSACTIONAL_API_KEY,
        },

        aws: {
            region: process.env.AWS_REGION,
            accountId: process.env.AWS_ACCOUNT_ID,

            sqs: {
                queueUrl: process.env.AWS_SQS_QUEUE_URL,
                queueName: process.env.AWS_SQS_QUEUE_NAME,
                accessKeyId: process.env.AWS_SQS_IAM_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SQS_IAM_SECRET_ACCESS_KEY,
            },
            ses: {
                accessKeyId: process.env.AWS_SES_IAM_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SES_IAM_SECRET_ACCESS_KEY,

                noreply: process.env.AWS_SES_NOREPLY_EMAIL,
                updates: process.env.AWS_SES_UPDATES_EMAIL,
            }
        }
    },



    extends: [
        './../library',
    ],

    alias: {
        '~~lib': resolve(__dirname, '../library'),
        '~lib/types': resolve(__dirname, '../library/shared/types'),
        '~lib/schemas': resolve(__dirname, '../library/shared/schemas'),
        '~lib/utils': resolve(__dirname, '../library/shared/utils'),
    },

    css: [
        '~/assets/scss/animations.scss',
        '~~lib/app/assets/scss/skeleton.scss',
        '~~lib/app/assets/scss/transition.scss',
        '~~lib/app/assets/scss/theme.scss',
        '~~lib/app/assets/scss/reset.scss',

        '~~lib/app/assets/scss/globals/index.scss',

        '~/assets/scss/global.scss',
    ],

    app: {
        pageTransition: { name: 'page-fade', mode: 'out-in' },

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

    routeRules: {
        '/dashboard/**': {
            ssr: false
        }
    },

    typescript: {
        strict: true
    },
})
