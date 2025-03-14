import { type UserRole } from "@@/shared/types/users"
import { type MinimalUserInfo } from "@@/shared/types/users/minimal"



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


    const mockUserData = useState<{ id: string, role: UserRole } | undefined>('mock-user-id', () => undefined)

    const actualUserId = computed<string | undefined>(() => {
        if (!user || !user.value) return undefined
        return user.value.user_id
    })

    const userId = computed<string | undefined>(() => {
        if (isMockingLoading.value) {
            return undefined
        }

        if (actualUserRole.value === 'admin' && mockUserData.value) {
            return mockUserData.value.id
        }
        return actualUserId.value
    })

    const isMockingUser = computed(() => 
        actualUserRole.value === 'admin' && (mockUserData.value !== undefined || isMockingRole.value)
    )

    const setMockUserData = async (userId: string | undefined) => {
        if (actualUserRole.value === 'admin' && userId) {
            console.log('Fetching mock user data for', userId)
            try {
                const response = await $fetch<MinimalUserInfo>(`/api/v1/auth/${userId}`, {
                    method: 'GET',
                })

                if (response) {
                    console.log('Setting mock user data to', response)
                    mockUserData.value = {
                        id: response.id,
                        role: response.role,
                    }

                    if (isMockingLoading.value) {
                        mockLoading.value = false
                    }
                }
            }
            catch (err) {
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
        mockUserRole.value !== undefined &&
        mockUserRole.value !== actualUserRole.value
    )

    const setMockRole = (role: UserRole | undefined) => {
        if (actualUserRole.value === 'admin') {
            clearMockUserData()
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

    const isSuperAdminUser = computed(() => userRole.value === 'super_admin')
    const isAdminUser = computed(() => userRole.value === 'admin')
    const isAdmin = computed(() => isAdminUser.value || isSuperAdminUser.value)
    const isClinicianUser = computed(() => userRole.value === 'clinician')
    const isPatientUser = computed(() => userRole.value === 'patient')
    const isIncompleteUser = computed(() => userRole.value === 'incomplete_user')

    const error = computed(() =>
        loggedIn.value && !user.value || loggedIn.value && !session.value
    )

    const mockUserAPIData = computed(() => {
        if (isMockingUser.value && mockUserData.value) {
            return {
                mock: {
                    id: mockUserData.value.id,
                    role: mockUserData.value.role
                }
            }
        }

        if (isMockingRole.value) {
            return {
                mock: {
                    role: mockUserRole.value
                }
            }
        }

        return undefined
    })

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
        isAdmin,
        isSuperAdminUser,
        isAdminUser,
        isClinicianUser,
        isPatientUser,
        isIncompleteUser,
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

        mockUserAPIData,

        clearMocks,

        // Replace mockUserId related functions with mockUserData
        isMockingUser,
        setMockUserData,
        clearMockUserData,
        userId,
        actualUserId,
    }
}