<template>
    <template v-if="ready">
        <slot
            v-bind="bindings"
            name="shared"
        />
        <template v-if="error">
            <slot
                v-bind="{ error }"
                name="error"
            />
        </template>
        <template v-else>
            <slot
                v-if="isAdminUser"
                v-bind="bindings"
                name="admin"
            />
            <slot
                v-else-if="isClinicianUser"
                v-bind="bindings"
                name="clinician"
            />
            <slot
                v-else-if="isPatientUser"
                v-bind="bindings"
                name="patient"
            />
            <slot
                v-else-if="loggedIn"
                v-bind="bindings"
                name="default"
            />
            <slot
                v-else
                v-bind="bindings"
                name="public"
            />
        </template>
    </template>
    <slot
        v-else
        name="loading"
    />
</template>

<script setup lang="ts">
import { type User, type UserSession } from '#auth-utils';
import type { UserRole } from '~~lib/shared/types/users';

// Auth state
interface AuthState {
    ready: ComputedRef<boolean>
    isAdminUser: ComputedRef<boolean>
    isClinicianUser: ComputedRef<boolean>
    isPatientUser: ComputedRef<boolean>
    loggedIn: ComputedRef<boolean>
    session: Ref<UserSession | null>
    error: ComputedRef<boolean>
    clearSession: () => void
    user: Ref<User | null>
    userRole: ComputedRef<UserRole | undefined>
    isMockingRole: ComputedRef<boolean>
    actualUserRole: ComputedRef<UserRole | undefined>
    setMockRole: (role: UserRole | undefined) => void
    clearMockRole: () => void
}

const state = useAuth()
const {
    ready,
    isAdminUser,
    isClinicianUser,
    isPatientUser,
    loggedIn,
    session,
    error,
    clearSession,
    user,
    userRole,
    isMockingRole,
    actualUserRole,
    setMockRole,
    clearMockRole
} = state

// Important: Pass the computed ref directly, not just its value
const bindings = {
    ready,
    isAdminUser,
    isClinicianUser,
    isPatientUser,
    loggedIn,
    error,
    session,
    user,
    userRole,
    isMockingRole,
    actualUserRole,
    setMockRole,
    clearMockRole,
    clearSession
}

defineSlots<{
    admin(props: AuthState): any
    clinician(props: AuthState): any
    patient(props: AuthState): any
    default(props: AuthState): any
    public(props: AuthState): any
    loading(): any
    error(props: { error: boolean }): any
    shared(props: AuthState): any
}>()
</script>