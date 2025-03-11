<template>
    <div class="patient-users-overview">

    </div>
</template>

<script lang="ts" setup>
import { type PatientUser } from '~~lib/shared/types/users/patient'

type Props = {
    users: PatientUser[];
}

const props = defineProps<Props>();
</script>