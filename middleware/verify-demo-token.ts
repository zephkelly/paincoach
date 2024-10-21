export default defineNuxtRouteMiddleware((to: any, from: any) => {
    const testToken = 'test'
    const token = to.params.token

    if (!token || token === '' ) {
        return navigateTo('/')
    }

    if (token !== testToken) {
        return navigateTo('/')
    }

    if(to.path.startsWith(`/demo/${token}`)) {
        console.log('valid route')
    }
})
  