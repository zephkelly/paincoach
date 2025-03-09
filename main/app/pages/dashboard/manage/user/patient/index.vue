<template>
    <Page padHeader>
        <template #header>
            <div class="user-patient-page-title">
                <Transition name="fade">
                    <h1 v-if="ready && userRole !== 'patient'">Manage Patients</h1>
                    <div v-else
                        class="user-patient-page-title skeleton-component skeleton-component-panel skeleton-component-border-radius"
                        :style="{ width: 350 * (0.85 + Math.random() * 0.15) + 'px'}"
                    ></div>
                </Transition>
            </div>
        </template>

        <div class="user-patient-page-content">
            <Tabs :tabs="patientTabs" :loading="!ready || userRole === 'patient'" :defaultTabIndex="tabQuery" />
        </div>
    </Page>
</template>

<script lang="ts" setup>
const {
    ready,
    userRole
} = useAuth();

watch(() => userRole.value, (role) => {
    const route = useRoute();

    if (role === 'patient') {
        navigateTo('/dashboard');
    }

    if (role === 'admin') {
        navigateTo('/dashboard/manage/user');
    }
}, { immediate: true });

const route = useRoute();
const tabQuery = computed(() => {
    if (route.query.tab) {
        const tabindex = parseInt(route.query.tab as unknown as string);

        navigateTo({
            path: route.path,
            query: {
                ...route.query,
                tab: undefined
            },
            replace: true
        });

        return tabindex;
    }
});


import AppUserManagerPatientNew from '~/components/dashboard/user/manager/patients/new.vue';
const patientTabs = [
    {
        label: 'Your Patients',
        component: undefined,
        headerWidth: 120
    },
    {
        label: 'Add New Patient',
        component: AppUserManagerPatientNew,
        headerWidth: 150
    },
]

definePageMeta({
    layout: 'app',
});
</script>

<style lang="scss" scoped>
.user-patient-page-title {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 40px;
    padding: 0rem 1rem;

    h1, .user-patient-page-title {
        position: absolute;
    }

    .user-patient-page-title {
        height: 40px;
    }
}

.user-patient-page-content {
    display: flex;
    flex-direction: column;
    position: relative;
    width: 100%;
    min-height: calc(100dvh - 2rem - 52px - 40px - 38px);
    background-color: var(--background-3-color);
}
</style>
