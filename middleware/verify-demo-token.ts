export default defineNuxtRouteMiddleware((to: any, from: any) => {
    const token = to.params.token

    if (!token || token === '' ) {
        return navigateTo('/')
    }

    if(to.path.startsWith(`/demo/${token}`)) {
        console.log('valid route')
    }
    else {
        console.log('invalid route')
        return navigateTo('/')
    }
})
  