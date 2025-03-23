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
</template>

<script setup lang="ts">
//@ts-expect-error
import { type User, type UserSession } from '#auth-utils';
import type { Role } from '@@/shared/types/users';
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
    userRole: ComputedRef<Role | undefined>
    isMockingRole: ComputedRef<boolean>
    actualUserRole: ComputedRef<Role | undefined>
}

import { useAuth } from '@/composables/useAuth';
const state = useAuth()
const {
    ready,
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

    clinician(props: AuthState): any

    patient(props: AuthState): any

    incomplete(props: AuthState): any

    namedDefault(props: AuthState): any

    public(props: AuthState): any

    loading(): any

    error(props: { error: boolean }): any

    shared(props: AuthState): any
}>()
</script>