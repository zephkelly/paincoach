<template>
    <Page class="dashboard">
        <template #header>
            <div class="dashboard-title">
                <h1>Dashboard</h1>
            </div>
        </template>
        <div class="dashboard-content">
            <div v-if="!ready" class="dashboard-loading">

            </div>
            <template v-else-if="hasRole('admin')">
                <DashboardAdmin />
            </template>
        </div>
    </Page>
</template>

<script lang="ts" setup>
const {
    ready,
    clearSession,
    fetchNewSession,
    hasRole,
} = useAuth();

async function logoutUser() {
    await clearSession();
    await fetchNewSession();
    
    return navigateTo('/dashboard/login');
}

definePageMeta({
    layout: 'app',
});
</script>

<style lang="scss" scoped>
.dashboard-title {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;

    gap: 1rem;
}

.dashboard-content {
    display: flex;
    gap: 1rem;
    width: 100%;
}

h1 {
    font-family: var(--geist-font-stack);
    font-size: 2rem;
}
</style>