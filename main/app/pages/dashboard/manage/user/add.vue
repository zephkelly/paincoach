<template>
    <PageTabs :tabs="currentTabs" :loading="!ready">
        <template #header>
            <h1>Add new users</h1>
        </template>
    </PageTabs>
</template>

<script lang="ts" setup>
import DashboardUserClinicianInvite from '~/components/dashboard/user/clinician/invite.vue';
import DashboardUserPatientInvite from '~/components/dashboard/user/patient/invite.vue';
import DashboardUserAdminInvite from '~/components/dashboard/user/admin/invite.vue';

const {
    ready,
    userRoles,
    primaryRole,
    hasRole
} = useAuth();

watch(() => userRoles.value, (role) => {
    if (primaryRole.value === 'patient') {
        navigateTo('/dashboard');
    }

    if (primaryRole.value === 'clinician') {
        navigateTo('/dashboard/manage/user/patient');
    }
}, { immediate: true });

const userTabs = [{
        label: 'Clinicians',
        component: DashboardUserClinicianInvite,
        headerWidth: 90
    }, {
        label: 'Admins',
        component: DashboardUserAdminInvite,
        headerWidth: 80
    }, {
        label: 'Patients',
        component: DashboardUserPatientInvite,
        headerWidth: 100
    }
]

const currentTabs = computed(() => {
    const role = primaryRole.value;

    if (hasRole('admin')) {
        return userTabs;
    }
    else {
        return [];
    }

    // switch(role) {
    //     case 'admin':
    //         return userTabs;
    //     case 'clinician':
    //         return []
    //     default:
    //         return []
    // }
})

definePageMeta({
    layout: 'app',
    middleware: 'manage-users-redirect'
});
</script>

<style lang="scss" scoped>
.user-add-page-content {
    display: flex;
    flex-direction: column;
    position: relative;
    min-height: calc(100dvh - 2rem - 52px - 40px - 38px);
    width: 100%;
    background-color: var(--background-3-color);
}
</style>
