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

    extends: [
        './layers/ember',
        './layers/paincrypt',
    ],

    modules: [
        '@nuxt/test-utils/module'
    ],

    typescript: {
        strict: true
    },
})
