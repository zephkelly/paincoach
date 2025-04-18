<template>
    <div class="invitation-sender-wrapper">
        <div class="invitation-sender-form-skeleton" v-if="loading || inviterRoles === undefined">

        </div>
        <form class="invitation-sender-form" v-else>
            <div class="preset-invitation-wrapper">
                <ESelect
                    id="preset-invitation-roles"
                    :options="presetInvitationOptions"
                    placeholder="Select preset"
                    class="invitation-sender-form__select"
                />
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import type { AllRoles, Role } from '@@/shared/types/v1/role';

type InvitationSenderForm = {
    inviterRoles: AllRoles[] | undefined;
    loading?: boolean;
}

const presetInvitationOptions = [
    { label: 'Owner', value: 'owner' },
    { label: 'Admin', value: 'admin' },
    { label: 'Clinician', value: 'clinician' },
    { label: 'Patient', value: 'patient' },
];

const props = defineProps<InvitationSenderForm>();
</script>