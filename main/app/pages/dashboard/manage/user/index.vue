<template>
    <PageTabs :tabs="currentTabs" :loading="!ready">
        <template #header>
            <h1 class="title">Your users</h1>
        </template>

        <template #default>
            <div class="user-page-content">
                <component :is="tab.component" v-for="(tab, index) in currentTabs" :key="index" />
            </div>
        </template>
    </PageTabs>
</template>

<script lang="ts" setup>
import DashboardUserOverview from '~/components/dashboard/user/overview.vue';

const {
    ready,
    userRole
} = useAuth();

const {
    state,
    fetch
} = await useUsers();

fetch();

watch(() => userRole.value, (role) => {
    if (role === 'patient') {
        navigateTo('/dashboard');
    }

    // if (role === 'clinician') {
    //     navigateTo('/dashboard/manage/user/patient');
    // }
}, { immediate: true });

const adminUserTabs = [{
        label: 'Overview',
        component: DashboardUserOverview,
        headerWidth: 100
    }
]

const currentTabs = computed(() => {
    const role = userRole.value;

    switch(role) {
        case 'admin':
            return adminUserTabs;
        case 'clinician':
            return []
        default:
            return []
    }
})

definePageMeta({
    layout: 'app',
    middleware: 'manage-users-redirect'
});
</script>

<style lang="scss" scoped>
.user-page-content {
    display: flex;
    flex-direction: column;
    position: relative;
    width: 100%;
    min-height: calc(100dvh - 2rem - 52px - 40px - 38px);
    background-color: var(--background-2-color);
}
</style>
