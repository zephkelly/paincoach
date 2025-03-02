<template>
    <Page class="dashboard">
        <div class="dashboard-title">
            <h1>Dashboard</h1>
            <AppAccountRoleChip :userRole="userRole" />
        </div>
    </Page>
</template>

<script lang="ts" setup>
const {
    clear,
    fetch: refreshUserSession
} = useUserSession();

const {
    userRole
} = useAuth();


async function logoutUser() {
    await clear();
    await refreshUserSession();
    
    return navigateTo('/app/login');
}

definePageMeta({
    layout: 'app',
});
</script>

<style lang="scss">
html {
    background-color: var(--background-color);
}

body {
    color: var(--text-color);
}
</style>

<style lang="scss" scoped>
.dashboard-title {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;

    gap: 1rem;
}
h1 {
    font-family: var(--geist-font-stack);
    font-size: 2rem;
    margin-bottom: 1rem;
}
</style>