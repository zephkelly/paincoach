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
        './layers/paincrypt',
        './layers/ember',
        './layers/abtesting'
    ],

    modules: [
        '@nuxt/test-utils/module'
    ],

    typescript: {
        strict: true
    },

    css: [
        '@/assets/scss/reset.scss',
        '@/assets/scss/global.scss',
        '@/assets/scss/globals/index.scss',
        
        '@/assets/scss/animations.scss',
        '@/assets/scss/skeleton.scss',
        '@/assets/scss/transition.scss',
        '@/assets/scss/theme.scss',
    ]
})
