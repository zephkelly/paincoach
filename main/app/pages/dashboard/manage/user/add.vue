<template>
    <Page padHeader>
        <template #header>
            <h1>Add New Users</h1>
        </template>

        <div class="user-add-page-contentas">
            <Tabs :tabs="currentTabs" :loading="!ready" />
        </div>
    </Page>
</template>

<script lang="ts" setup>
import DashboardManageUserAdminClinicianInvite from '~/components/dashboard/manage/user/admin/clinician/invite.vue';
import DashboardManageUserAdminInvite from '~/components/dashboard/manage/user/admin/invite.vue';

const {
    ready,
    userRole
} = useAuth();

watch(() => userRole.value, (role) => {
    if (role === 'patient') {
        navigateTo('/dashboard');
    }

    if (role === 'clinician') {
        navigateTo('/dashboard/manage/user/patient');
    }
}, { immediate: true });

const userTabs = [{
        label: 'Clinicians',
        component: DashboardManageUserAdminClinicianInvite,
        headerWidth: 90
    }, {
        label: 'Admins',
        component: DashboardManageUserAdminInvite,
        headerWidth: 80
    }, {
        label: 'Patients',
        component: undefined,
        headerWidth: 100
    }
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
.user-add-page-content {
    display: flex;
    flex-direction: column;
    position: relative;
    min-height: calc(100dvh - 2rem - 52px - 40px - 38px);
    width: 100%;
    background-color: var(--background-3-color);
}
</style>
