export function useDemoToken() {
    const route = useRoute()
  
    const token = ref('')
    const baseDemoRoute = ref('')
  
    const updateToken = (newToken?: string) => {
        if (newToken) {
            token.value = newToken
            return
        }

        const routeToken = route.params.token
        if (typeof routeToken === 'string') {
            token.value = routeToken
            baseDemoRoute.value = '/demo/' + routeToken
        }
    }
  
    updateToken()

    watch(() => route.params.token, (newToken) => {
        updateToken(newToken as string)
    })
  
    return {
        token,
        baseDemoRoute,
    }
}