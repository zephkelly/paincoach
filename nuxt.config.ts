// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    css: ['~/assets/scss/global.scss'],
    runtimeConfig: {
        mailchimpDc: process.env.MAILCHIMP_DC,
        mailchimpListId: process.env.MAILCHIMP_LIST_ID,
        mailchimpApiKey: process.env.MAILCHIMP_API_KEY,
    },
})
