<template>
    <div class="patient-users-overview">
        <DashboardUserOverviewList :title="title" listRole="patient" :users="patientUsers" :loading="!ready" :showRole="showRole" >
            <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></g></svg>
            </template>
        </DashboardUserOverviewList>
    </div>
</template>

<script lang="ts" setup>
import { type PatientUser } from '~~lib/shared/types/users/patient'

const {
    ready,
} = useAuth();

type Props = {
    users?: PatientUser[];
    showRole?: boolean;
    title?: string;
}

const props = defineProps<Props>();

const {
    patientUsers
} = await useUsers();
</script>