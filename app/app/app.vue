<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>

<script setup lang="ts">
const {
    fetchNewSession,
    session,
    loggedIn
} = useAuth();
</script>