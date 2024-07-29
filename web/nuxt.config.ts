import { resolve } from 'path'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: { enabled: true },
    css: ['../src/assets/css/reset.css', '../src/assets/css/main.css', '../src/assets/css/global.css'],
    components: [{
        path: '../src/components',
        pathPrefix: true,
    },],
    imports: {
        dirs: [
            '../src/composables',
            '../src/types',
            '../src/assets',
            '../src/components',
        ],
    },
    alias: {
        '@': resolve(__dirname, '../src'),
        '@components': resolve(__dirname, '../src/components/*'),
        '@composables': resolve(__dirname, '../src/composables'),
        '@assets': resolve(__dirname, '../src/assets'),
        '@types': resolve(__dirname, '../src/types')
    },
    // srcDir: '../src',
    typescript: {
        tsConfig: {
            compilerOptions: {
                types: ["@types/node", "nuxt"]
            },
            include: [
                "../src/**/*.ts",
                "../src/**/*.d.ts",
                "../src/**/*.tsx",
                "../src/**/*.vue"
            ]
        }
      }
});
