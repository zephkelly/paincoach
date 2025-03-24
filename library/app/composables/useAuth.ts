import type { Role, AllRoles } from "@@/shared/types/v1/role"
import { type MinimalUser } from "@@/shared/types/v1/user/minimal"



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


    const mockUserData = useState<{ id: string, role: Role } | undefined>('mock-user-id', () => undefined)

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
                const response = await $fetch<MinimalUser>(`/api/v1/auth/${userId}`, {
                    method: 'GET',
                })

                if (response) {
                    console.log('Setting mock user data to', response)
                    mockUserData.value = {
                        id: response.uuid,
                        role: response.primary_role,
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
    const mockUserRole = useState<Role | undefined>('mock-user-role', () => undefined)

    const actualUserRole = computed<Role | undefined>(() => {
        if (!user || !user.value) return undefined
        return user.value.user_role
    })

    const userRole = computed<AllRoles | undefined>(() => {
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

    const setMockRole = (role: Role | undefined) => {
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

    const isAdminUser = computed(() => userRole.value === 'admin')
    const isClinicianUser = computed(() => userRole.value === 'clinician')
    const isPatientUser = computed(() => userRole.value === 'patient')
    const isIncompleteUser = computed(() => userRole.value === 'unregistered')

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