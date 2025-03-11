<template>
    <div class="clinician-users-overview">

    </div>
</template>

<script lang="ts" setup>
import { type ClinicianUser } from '~~lib/shared/types/users/clinician'

type Props = {
    users: ClinicianUser[];
}

const props = defineProps<Props>();
</script>