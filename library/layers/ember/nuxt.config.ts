export default defineNuxtConfig({
    devtools: { enabled: true },
    compatibilityDate: '2024-11-01',


    components: [
        {
            path: './components',
            prefix: 'E',
        }
    ],

    typescript: {
        strict: true
    },
})
