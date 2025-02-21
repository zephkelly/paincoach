export default defineAppConfig({
  myLayer: {
    name: 'paincoach/shared'
  }
})

declare module '@nuxt/schema' {
  interface AppConfigInput {
    myLayer?: {
      /** Project name */
      name?: string
    }
  }
}
