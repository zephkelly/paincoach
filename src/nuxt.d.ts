declare module '#app' {
    interface NuxtApp {
      // Your custom extensions to NuxtApp
    }
  }
  
  declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
      // Your custom global properties
    }
  }
  
  export {}