<template>
    <Page nopad>
        <template #header>
            <h1>Manage Users</h1>
        </template>

        <div class="user-page-content">
            <Tabs :tabs="currentTabs" :loading="!ready" />
        </div>
    </Page>
</template>

<script lang="ts" setup>
import DashboardManageUserAdminClinicianInvite from '~/components/dashboard/manage/user/admin/clinician/invite.vue';
import DashboardManageUserAdminInvite from '~/components/dashboard/manage/user/admin/invite.vue';

const {
    ready,
    actualUserRole,
    userRole
} = useAuth();

watch(() => userRole.value, (role) => {
    if (role === 'patient') {
        navigateTo('/dashboard');
    }
});

const userTabs = [
    {
        label: 'Patients',
        component: undefined,
        headerWidth: 100
    },
    {
        label: 'Clinicians',
        component: DashboardManageUserAdminClinicianInvite,
        headerWidth: 90
    },
    {
        label: 'Admins',
        component: DashboardManageUserAdminInvite,
        headerWidth: 80
    },
]

const currentTabs = computed(() => {
    const role = userRole.value;

    switch(role) {
        case 'admin':
            return userTabs;
        case 'clinician':
            return []
        default:
            return []
    }
})

definePageMeta({
    layout: 'app',
    middleware: 'manage-users-redirect'
});
</script>

<style lang="scss" scoped>
.user-page-content {
    display: flex;
    flex-direction: column;
    position: relative;
    min-height: calc(100dvh - 2rem - 52px - 40px - 38px);
    background-color: var(--background-2-color);
}
</style>
