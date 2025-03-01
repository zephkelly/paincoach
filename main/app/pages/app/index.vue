<template>
    <div class="page">
        <!-- <AuthState v-slot="{ loggedIn, user }">
            <div class="authed" v-if="loggedIn">
                <div class="admin" v-if="user?.user_role === 'admin'">
                    <h1>Admin App</h1>
                    <p>Welcome, {{ user?.name }}</p>

                    <EButton @click="logoutUser()">
                        Logout
                    </EButton>
                </div>
            </div>
        </AuthState> -->

        <AppAuthenticator>
            <template #loading>
                <div class="loading-skeleton skeleton-component">
                    <div class="skeleton-row">
                        <div class="skeleton-avatar"></div>
                        <div class="skeleton-text"></div>
                    </div>
                </div>
            </template>

            <template #shared>
                <h1>Dashboard</h1>
            </template>

            <template #admin="{ user }">
                <div class="admin">
                    <p>Welcome, {{ user.value?.name }}</p>

                    <EButton @click="logoutUser()">
                        Logout
                    </EButton>
                </div>
            </template>
        </AppAuthenticator>
    </div>
</template>

<script lang="ts" setup>
const {
    clear,
    fetch: refreshUserSession
} = useUserSession();

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
.page {
    margin-top: 2rem;
}

h1 {
    font-family: var(--geist-font-stack);
    font-size: 2rem;
    margin-bottom: 1rem;
}
</style>