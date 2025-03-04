<template>
    <Page class="dashboard">
        <template #header>
            <div class="dashboard-title">
                <h1>Dashboard</h1>
            </div>
        </template>
        <div class="dashboard-content">
        </div>
    </Page>
</template>

<script lang="ts" setup>
const {
    ready,
    userRole,
    clearSession,
    fetchNewSession
} = useAuth();

async function logoutUser() {
    await clearSession();
    await fetchNewSession();
    
    return navigateTo('/app/login');
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
    flex-direction: column;
    gap: 1rem;
    height: 600px;
}

h1 {
    font-family: var(--geist-font-stack);
    font-size: 2rem;
}
</style>