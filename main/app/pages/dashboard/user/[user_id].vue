<template>
    <Page>
        <h1>Hello</h1>

    </Page>
</template>

<script lang="ts" setup>
const route = useRoute()

const user_id = route.params.user_id

onMounted(() => {
    if (!user_id) {
        navigateTo('/dashboard')
    }
})

definePageMeta({
    middleware: ['auth-admin-clinician'],
})
</script>