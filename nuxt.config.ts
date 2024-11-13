// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    css: [
        '~/assets/scss/reset.scss',
        '~/assets/scss/global.scss',
        '~/assets/scss/main.scss',
        '~/assets/scss/animations.scss',
    ],
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    api: 'modern-compiler',
                },
            },
        },
    },
    runtimeConfig: {
        databaseConnectionString: process.env.POSTGRES_CONNECTION_STRING,
        mailchimpDc: process.env.MAILCHIMP_DC,
        mailchimpListId: process.env.MAILCHIMP_LIST_ID,
        mailchimpApiKey: process.env.MAILCHIMP_API_KEY,
        mailchimpTransactionalApiKey: process.env.MAILCHIMP_TRANSACTIONAL_API_KEY,
    },
    modules: ['nuxt-gtag', 'nuxt-nodemailer'],
    nodemailer: {
        from: `Lachlan Townend <${process.env.NUXT_NODEMAILER_AUTH_USER}>`,
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.NUXT_NODEMAILER_AUTH_USER,
            pass: process.env.NUXT_NODEMAILER_AUTH_PASSWORD,
        },
    },
    gtag: {
        id: 'G-4P6YS7XXY3',
    },
    typescript: {
        strict: true,
    },
    middleware: ['verifyDemoToken'],
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
    serverMiddleware: [{ 
            path: '/demo', handler: '~/server/middleware/verify-demo-token.ts' 
        }
    ],
    nitro: {
        routeRules: {
            '/images/**': { headers: { 'cache-control': 'max-age=31536000, immutable' } },
            '/fonts/**': { headers: { 'cache-control': 'max-age=31536000, immutable' } },

            '/demo/**': { ssr: false },
        }
    }
})