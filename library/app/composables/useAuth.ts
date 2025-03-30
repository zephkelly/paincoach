import type { Role, AllRoles } from "@@/shared/types/v1/role"
import type { LimitedUserWithRoles } from "@@/shared/types/v1/user/limited"
// import { type LimitedUser } from "@@/shared/types/v1/user/minimal"



export const useAuth = () => {
    //@ts-expect-error
    const { loggedIn, user, clear, ready, session, fetch } = useUserSession()

    const mockLoading = useState<boolean>('mock-loading-state', () => false)

    const toggleMockLoading = () => {
        mockLoading.value = !mockLoading.value
    }

    // Add mock loading functionality (only available for admins)
    const setMockLoading = (isLoading: boolean) => {
        if (hasRole('admin')) {
            console.log('Setting mock loading state to', isLoading)
            mockLoading.value = isLoading
        }
    }

    const clearMockLoading = () => {
        mockLoading.value = false
    }

    const mockReadyState = computed(() => {
        if (hasRole('admin', true) && mockLoading.value) {
            return false
        }
        return ready.value
    })

    const isMockingLoading = computed(() =>
        isPrivilegedUser.value && mockLoading.value
    )

    const mockUserData = useState<{ id: string, roles: Role[] } | undefined>('mock-user-id', () => undefined)

    const actualUserId = computed<string | undefined>(() => {
        if (!user || !user.value) return undefined
        return user.value.user_id
    })

    const userId = computed<string | undefined>(() => {
        if (isMockingLoading.value) {
            return undefined
        }

        if (isPrivilegedUser.value && mockUserData.value) {
            return mockUserData.value.id
        }
        return actualUserId.value
    })

    const isMockingUser = computed(() => 
        isPrivilegedUser.value && (mockUserData.value !== undefined || isMockingRoles.value)
    )

    const setMockUserData = async (userId: string | undefined) => {
        if (isPrivilegedUser.value && userId) {
            console.log('Fetching mock user data for', userId)
            try {
                const response = await $fetch<LimitedUserWithRoles>(`/api/v1/auth/${userId}`, {
                    method: 'GET',
                })

                if (response) {
                    console.log('Setting mock user data to', response)
                    mockUserData.value = {
                        id: response.uuid,
                        roles: response.roles || [response.primary_role],
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

    // Updated to handle array of roles
    const mockUserRoles = useState<Role[] | undefined>('mock-user-roles', () => undefined)
    const mockPrimaryRole = useState<AllRoles | undefined>('mock-primary-role', () => undefined)

    const actualUserRoles = computed<AllRoles[] | undefined>(() => {
        if (!user || !user.value) return undefined
        return user.value.roles || [user.value.primary_role]
    })

    const actualPrimaryRole = computed<AllRoles | undefined>(() => {
        if (!user || !user.value) return undefined
        return user.value.primary_role
    })

    const userRoles = computed<AllRoles[] | undefined>(() => {
        if (isMockingLoading.value) {
            return undefined
        }

        if (isPrivilegedUser.value && mockUserRoles.value) {
            return mockUserRoles.value
        }

        if (isPrivilegedUser.value && mockUserData.value?.roles) {
            return mockUserData.value.roles
        }

        return actualUserRoles.value
    })

    const primaryRole = computed<AllRoles | undefined>(() => {
        if (isMockingLoading.value) {
            return undefined
        }

        if (isPrivilegedUser.value && mockPrimaryRole.value) {
            return mockPrimaryRole.value
        }

        if (isPrivilegedUser.value && mockUserRoles.value && mockUserRoles.value.length > 0) {
            return mockUserRoles.value[0]
        }

        if (isPrivilegedUser.value && mockUserData.value?.roles && mockUserData.value.roles.length > 0) {
            return mockUserData.value.roles[0]
        }

        return actualPrimaryRole.value
    })

    const capitalisedPrimaryRole = computed(() => {
        if (!primaryRole.value) return undefined
        return primaryRole.value.charAt(0).toUpperCase() + primaryRole.value.slice(1)
    })

    const isMockingRoles = computed(() =>
        isPrivilegedUser.value && (
            (mockUserRoles.value !== undefined && !arraysEqual(mockUserRoles.value, actualUserRoles.value || [])) ||
            (mockPrimaryRole.value !== undefined && mockPrimaryRole.value !== actualPrimaryRole.value)
        )
    )

    // Helper function to compare arrays
    const arraysEqual = (a: any[], b: any[]) => {
        if (a.length !== b.length) return false
        return a.every((val, index) => val === b[index])
    }

    const setMockRoles = (roles: Role[] | undefined, primaryRole?: AllRoles) => {
        if (isPrivilegedUser.value) {
            clearMockUserData()
            mockUserRoles.value = roles
            
            // If primary role is explicitly provided, use it
            if (primaryRole) {
                mockPrimaryRole.value = primaryRole
            } 
            // Otherwise, use the first role in the array if available
            else if (roles && roles.length > 0) {
                mockPrimaryRole.value = roles[0]
            } 
            // Clear the mock primary role if no roles are provided
            else {
                mockPrimaryRole.value = undefined
            }

            if (isMockingLoading.value) {
                mockLoading.value = false
            }
        }
    }
    
    // Allow explicitly setting a primary role
    const setMockPrimaryRole = (role: AllRoles | undefined) => {
        if (isPrivilegedUser.value) {
            mockPrimaryRole.value = role
            
            if (isMockingLoading.value) {
                mockLoading.value = false
            }
        }
    }

    const clearMockRoles = () => {
        mockUserRoles.value = undefined
        mockPrimaryRole.value = undefined
    }

    // Function to check if user has a specific role
    const hasRole = (role: AllRoles, useActualRoles: boolean = false) => {
        const rolesToCheck = useActualRoles ? actualUserRoles.value : userRoles.value
        if (!rolesToCheck) return false
        return rolesToCheck.includes(role)
    }

    const verified = computed(() => {
        if (!user || !user.value) return false
        return user.value.verified
    })

    // Update privilege check to use roles array
    const isPrivilegedUser = computed(() => 
        hasRole('admin', true) || hasRole('owner', true)
    )

    // Update all role-based checks to use the hasRole function
    const isOwnerUser = computed(() => hasRole('owner'))
    const isAdminUser = computed(() => hasRole('admin'))
    const isClinicianUser = computed(() => hasRole('clinician'))
    const isPatientUser = computed(() => hasRole('patient'))
    const isIncompleteUser = computed(() => hasRole('unregistered'))

    const error = computed(() =>
        loggedIn.value && !user.value || loggedIn.value && !session.value
    )

    const mockUserAPIData = computed(() => {
        if (isMockingUser.value && mockUserData.value) {
            return {
                mock: {
                    id: mockUserData.value.id,
                    roles: mockUserData.value.roles,
                    primary_role: mockUserData.value.roles[0]
                }
            }
        }

        if (isMockingRoles.value) {
            const data: any = {
                mock: {
                    roles: mockUserRoles.value
                }
            }
            
            if (mockPrimaryRole.value) {
                data.mock.primary_role = mockPrimaryRole.value
            } else if (mockUserRoles.value && mockUserRoles.value.length > 0) {
                data.mock.primary_role = mockUserRoles.value[0]
            }
            
            return data
        }

        return undefined
    })

    const clearMocks = () => {
        clearMockRoles()
        clearMockLoading()
        clearMockUserData()
    }

    return {
        ready: mockReadyState,
        loggedIn,
        userRoles,
        primaryRole,
        capitalisedPrimaryRole,
        actualPrimaryRole,
        actualUserRoles,
        verified,
        user,
        session,
        error,
        clearSession: clear,
        fetchNewSession: fetch,
        isPrivilegedUser,
        isOwnerUser,
        isAdminUser,
        isClinicianUser,
        isPatientUser,
        isIncompleteUser,
        hasRole, // Expose the hasRole function
        isMockingRoles,
        setMockRoles,
        setMockPrimaryRole,
        clearMockRoles,
        // Add new mock loading functions
        toggleMockLoading,
        setMockLoading,
        clearMockLoading,
        isMockingLoading,
        // Optionally expose both ready states for debugging
        actualReadyState: ready,

        mockUserAPIData,

        clearMocks,

        // Expose user data functions
        isMockingUser,
        // setMockUserData, // Commented out as in your second paste
        clearMockUserData,
        userId,
        actualUserId,
    }
}