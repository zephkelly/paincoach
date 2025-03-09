import { type UserRole } from "@@/shared/types/users"

export const useAuth = () => {
    //@ts-expect-error
    const { loggedIn, user, clear, ready, session, fetch } = useUserSession()

    const mockLoading = useState<boolean>('mock-loading-state', () => false)

    const toggleMockLoading = () => {
        mockLoading.value = !mockLoading.value
    }

    // Add mock loading functionality (only available for admins)
    const setMockLoading = (isLoading: boolean) => {
        if (actualUserRole.value === 'admin') {
            console.log('Setting mock loading state to', isLoading)
            mockLoading.value = isLoading
        }
    }

    const clearMockLoading = () => {
        mockLoading.value = false
    }

    const mockReadyState = computed(() => {
        if (actualUserRole.value === 'admin' && mockLoading.value) {
            return false
        }
        return ready.value
    })

    const isMockingLoading = computed(() =>
        actualUserRole.value === 'admin' && mockLoading.value
    )


    // Replace mockUserId with mockUserData
    const mockUserData = useState<any | undefined>('mock-user-data', () => undefined)

    const actualUserId = computed<string | undefined>(() => {
        if (!user || !user.value) return undefined
        return user.value.user_id
    })

    const userId = computed<string | undefined>(() => {
        if (isMockingLoading.value) {
            return undefined
        }

        if (actualUserRole.value === 'admin' && mockUserData.value) {
            return mockUserData.value.user_id
        }
        return actualUserId.value
    })

    const isMockingUserData = computed(() =>
        actualUserRole.value === 'admin' &&
        mockUserData.value !== undefined
    )

    const setMockUserData = async (userId: string | undefined) => {
        if (actualUserRole.value === 'admin' && userId) {
            console.log('Fetching mock user data for', userId)
            try {
                // Make API call to get user data
                const response = await $fetch(`/api/v1/auth/${userId}`, {
                    method: 'GET',
                    headers: useRequestHeaders(['cookie']),
                })

                if (response.data) {
                    console.log('Setting mock user data to', data.value)
                    mockUserData.value = data.value

                    if (isMockingLoading.value) {
                        mockLoading.value = false
                    }
                }
            } catch (err) {
                console.error('Exception when fetching mock user data:', err)
            }
        }
    }

    const clearMockUserData = () => {
        mockUserData.value = undefined
    }


    // Keep the existing mockUserRole functionality
    const mockUserRole = useState<UserRole | undefined>('mock-user-role', () => undefined)

    const actualUserRole = computed<UserRole | undefined>(() => {
        if (!user || !user.value) return undefined
        return user.value.user_role
    })

    const userRole = computed<UserRole | undefined>(() => {
        if (isMockingLoading.value) {
            return undefined
        }

        if (actualUserRole.value === 'admin' && mockUserRole.value) {
            return mockUserRole.value
        }
        return actualUserRole.value
    })

    const capitalisedUserRole = computed(() => {
        if (!userRole.value) return undefined
        return userRole.value.charAt(0).toUpperCase() + userRole.value.slice(1)
    })

    const isMockingRole = computed(() =>
        actualUserRole.value === 'admin' &&
        mockUserRole.value !== null &&
        mockUserRole.value !== actualUserRole.value
    )

    const setMockRole = (role: UserRole | undefined) => {
        if (actualUserRole.value === 'admin') {
            console.log('Setting mock role to', role)
            mockUserRole.value = role

            if (isMockingLoading.value) {
                mockLoading.value = false
            }
        }
    }

    const clearMockRole = () => {
        mockUserRole.value = undefined
    }


    const verified = computed(() => {
        if (!user || !user.value) return false
        return user.value.verified
    })

    const isAdminUser = computed(() => userRole.value === 'admin')
    const isClinicianUser = computed(() => userRole.value === 'clinician')
    const isPatientUser = computed(() => userRole.value === 'patient')

    const error = computed(() =>
        loggedIn.value && !user.value || loggedIn.value && !session.value
    )

    const clearMocks = () => {
        clearMockRole()
        clearMockLoading()
        clearMockUserData()
    }

    return {
        ready: mockReadyState,
        loggedIn,
        userRole,
        capitalisedUserRole,
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
        // Add new mock loading functions
        toggleMockLoading,
        setMockLoading,
        clearMockLoading,
        isMockingLoading,
        // Optionally expose both ready states for debugging
        actualReadyState: ready,

        clearMocks,

        // Replace mockUserId related functions with mockUserData
        isMockingUserData,
        setMockUserData,
        clearMockUserData,
        userId,
        actualUserId,
    }
}