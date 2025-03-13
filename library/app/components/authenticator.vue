<template>
        <slot v-bind="bindings" />

        <slot
            v-bind="bindings"
            name="public"
        />
        
        <template v-if="ready">
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
                    v-else-if="isIncompleteUser"
                    v-bind="bindings"
                    name="incomplete"
                />
                <slot
                    v-else-if="loggedIn"
                    v-bind="bindings"
                    name="namedDefault"
                />
                <slot
                    v-bind="bindings"
                    name="shared"
                />
            </template>
        </template>
        <slot
            v-else
            name="loading"
        />
        <template v-if="actualReadyState">
            <template v-if="error">
                <slot
                    v-bind="{ error }"
                    name="errorActual"
                />
            </template>
            <template v-else>
                <slot
                    v-if="actualUserRole === 'admin'"
                    v-bind="bindings"
                    name="adminActual"
                />
                <slot
                    v-else-if="actualUserRole === 'clinician'"
                    v-bind="bindings"
                    name="clinicianActual"
                />
                <slot
                    v-else-if="actualUserRole === 'patient'"
                    v-bind="bindings"
                    name="patientActual"
                />
                <slot
                    v-else-if="loggedIn"
                    v-bind="bindings"
                    name="defaultActual"
                />
                <slot
                    v-bind="bindings"
                    name="sharedActual"
                />
            </template>
        </template>
        <slot
            v-else
            name="loadingActual"
        />
</template>

<script setup lang="ts">
//@ts-expect-error
import { type User, type UserSession } from '#auth-utils';
import type { UserRole } from '@@/shared/types/users';
import { computed } from 'vue';

type AuthenticatorProps = {
    flex?: 'vertical' | 'horizontal'
}

const props = defineProps<AuthenticatorProps>()

interface AuthState {
    ready: ComputedRef<boolean>
    isAdminUser: ComputedRef<boolean>
    isClinicianUser: ComputedRef<boolean>
    isPatientUser: ComputedRef<boolean>
    isIncompleteUser: ComputedRef<boolean>
    loggedIn: ComputedRef<boolean>
    session: Ref<UserSession | null>
    error: ComputedRef<boolean>
    clearSession: () => void
    user: Ref<User | null>
    userRole: ComputedRef<UserRole | undefined>
    isMockingRole: ComputedRef<boolean>
    actualUserRole: ComputedRef<UserRole | undefined>
}

import { useAuth } from '@/composables/useAuth';
const state = useAuth()
const {
    ready,
    actualReadyState,
    isAdminUser,
    isClinicianUser,
    isPatientUser,
    isIncompleteUser,
    loggedIn,
    session,
    error,
    clearSession,
    user,
    userRole,
    isMockingRole,
    actualUserRole,
} = state

const bindings = {
    ready,
    isAdminUser,
    isClinicianUser,
    isPatientUser,
    isIncompleteUser,
    loggedIn,
    error,
    session,
    user,
    userRole,
    isMockingRole,
    actualUserRole,
    clearSession,
}

defineSlots<{
    default(props: AuthState): any
    
    admin(props: AuthState): any
    adminActual(props: AuthState): any

    clinician(props: AuthState): any
    clinicianActual(props: AuthState): any

    patient(props: AuthState): any
    patientActual(props: AuthState): any

    incomplete(props: AuthState): any

    namedDefault(props: AuthState): any
    defaultActual(props: AuthState): any

    public(props: AuthState): any

    loading(): any
    loadingActual(): any

    error(props: { error: boolean }): any
    errorActual(props: { error: boolean }): any

    shared(props: AuthState): any
    sharedActual(props: AuthState): any
}>()
</script>