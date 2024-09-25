// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    css: ['~/assets/scss/global.scss'],
    runtimeConfig: {
        mailchimpDc: process.env.MAILCHIMP_DC,
        mailchimpListId: process.env.MAILCHIMP_LIST_ID,
        mailchimpApiKey: process.env.MAILCHIMP_API_KEY,
    },
    imports: {
        dirs: ['composables']
    },
    modules: ['nuxt-gtag'],
    gtag: {
        id: 'G-4P6YS7XXY3',
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
    nitro: {
        routeRules: {
            '/images/**': { headers: { 'cache-control': 'max-age=31536000, immutable' } },
            '/fonts/**': { headers: { 'cache-control': 'max-age=31536000, immutable' } },
        }
    }
})
