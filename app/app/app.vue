<template>
    <NuxtLayout>
        <PWAInstaller />
        <NuxtPage />
    </NuxtLayout>
</template>

<script setup lang="ts">
const { session } = useAuth();
</script>

<style lang="scss" scoped>

</style>