import { navigateTo } from "nuxt/app"

export default defineNuxtRouteMiddleware((to: any, from: any) => {
    const token = to.params.token
  
    // This is a placeholder function. You should implement
    // actual token verification logic here.
    const isValidToken = (token: string) => {
      // Check if the token exists in your database
      // or verify it against some criteria
      return true // or false
    }
  
    if (to.path.startsWith('/demo/') && !isValidToken(token)) {
      // Redirect to an error page or back to the landing page
      return navigateTo('/')
    }
  })
  