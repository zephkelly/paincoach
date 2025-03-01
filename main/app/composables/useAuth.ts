import { type UserRole } from "~~lib/shared/types/users"



export const useAuth = () => {
    const { loggedIn, user, clear, ready, session, fetch } = useUserSession()
    
    const mockUserRole = useState<UserRole | undefined>('mock-user-role', () => undefined)
    
    const actualUserRole = computed<UserRole | undefined>(() => {
        if (!user || !user.value) return undefined
        return user.value.user_role
    })
    
    const userRole = computed<UserRole | undefined>(() => {
        if (actualUserRole.value === 'admin' && mockUserRole.value) {
            return mockUserRole.value
        }
        return actualUserRole.value
    })
    
    const verified = computed(() => {
        if (!user || !user.value) return false
        return user.value.verified
    })
    
    const isAdminUser = computed(() => userRole.value === 'admin')
    const isClinicianUser = computed(() => userRole.value === 'clinician')
    const isPatientUser = computed(() => userRole.value === 'patient')
    
    const isMockingRole = computed(() => 
        actualUserRole.value === 'admin' && 
        mockUserRole.value !== null && 
        mockUserRole.value !== actualUserRole.value
    )
    
    const error = computed(() =>
        loggedIn.value && !user.value || loggedIn.value && !session.value
    )
    
    const setMockRole = (role: UserRole | undefined) => {
        if (actualUserRole.value === 'admin') {
            console.log('Setting mock role to', role)
            mockUserRole.value = role
        }
    }
    
    const clearMockRole = () => {
        mockUserRole.value = undefined
    }
    
    return {
        ready,
        loggedIn,
        userRole,
        actualUserRole,
        verified,
        user,
        session,
        error,
        clearSession: clear,
        fetchNewSession: fetch,
        isAdminUser,
        isClinicianUser,
        isPatientUser,
        isMockingRole,
        setMockRole,
        clearMockRole,
    }
}