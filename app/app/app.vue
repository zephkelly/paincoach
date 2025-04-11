<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>

<script setup lang="ts">
const { session } = useAuth();

console.log(session.value)
</script>

<style lang="scss" scoped>

</style>