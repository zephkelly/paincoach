<template>
    <div class="page">
        <AuthState v-slot="{ loggedIn, user }">
            <div class="authed" v-if="loggedIn">
                <div class="admin" v-if="user?.user_role === 'admin'">
                    <h1>Admin App</h1>
                    <p>Welcome, {{ user?.name }}</p>

                    <EButton @click="logoutUser()">
                        Logout
                    </EButton>
                </div>
            </div>
        </AuthState>
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

<style lang="scss" scoped>
.page {
    margin-top: 6rem;
}
</style>