<template>
    <Page nopad>
        <template #header>
            <h1>Manage Users</h1>
        </template>

        <div class="user-page-content">
            <Tabs :tabs="patientTabs" :loading="!ready || userRole === 'patient'" />
        </div>
    </Page>
</template>

<script lang="ts" setup>
const {
    ready,
    userRole
} = useAuth();

watch(() => userRole.value, (role) => {
    if (role === 'patient') {
        navigateTo('/dashboard');
    }
});

const patientTabs = [
    {
        label: 'Patients',
        component: undefined,
        headerWidth: 100
    },
    {
        label: 'Clinicians',
        component: undefined,
        headerWidth: 90
    },
    {
        label: 'Admins',
        component: undefined,
        headerWidth: 80
    },
]

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
