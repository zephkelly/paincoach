<template>
    <PageTabs :tabs="patientTabs" :loading="userRole === 'patient'">
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
    </PageTabs>
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


import DashboardUserPatientInvite from '~/components/dashboard/user/patient/invite.vue';
import DashboardUserPatientOverview from '~/components/dashboard/user/patient/overview.vue';
const patientTabs = [
    {
        label: 'Your Patients',
        component: DashboardUserPatientOverview,
        headerWidth: 120
    },
    {
        label: 'Add New Patient',
        component: DashboardUserPatientInvite,
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
