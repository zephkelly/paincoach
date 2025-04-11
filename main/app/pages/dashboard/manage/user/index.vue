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
import type { AllRoles } from '@@/shared/types/v1/role';
import DashboardUserOverview from '~/components/dashboard/user/overview/index.vue';

const {
    ready,
    userRoles,
    primaryRole
} = useAuth();

const {
    state,
    fetch
} = await useUsers();

fetch();

watch(() => userRoles.value, (roles: AllRoles[] | undefined) => {
    if (primaryRole.value === 'patient') {
        navigateTo('/dashboard');
    }

    if (primaryRole.value === 'clinician') {
        navigateTo('/dashboard/manage/user/patient');
    }
}, { immediate: true });

const adminUserTabs = [{
        label: 'Overview',
        component: DashboardUserOverview,
        headerWidth: 100
    }
]

const currentTabs = computed(() => {
    const role = primaryRole.value;

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
