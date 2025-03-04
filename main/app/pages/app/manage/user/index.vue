<template>
    <Page nopad>

    </Page>
</template>

<script lang="ts" setup>
const {
    ready,
    userRole
} = useAuth();

definePageMeta({
    layout: 'app',
    middleware: 'manage-users-redirect'
});
</script>

<style lang="scss" scoped>

</style>
