<template>
    <div class="invitation-sender-wrapper">
        <div class="invitation-sender-form-skeleton" v-if="loading || inviterRoles === undefined">

        </div>

        <div class="invitation-sender-form-noaccess" v-else-if="!loading && inviterRoles !== undefined && !hasValidRoles && !isAdmin">
            <p>You do not have permission to send invitations.</p>
        </div>

        <form class="invitation-sender-form" v-else>
            <div class="preset-invitation-wrapper">
                <EMultiSelect
                    id="preset-invitation-roles"
                    class="invitation-sender-form__preset-select"
                    v-model="presetInvitation"

                    placeholder="Select preset"

                    :options="presetInvitationOptions"
                    no-option-undefined="No preset"
                />
            </div>

            <!-- <EFieldRenderer
             :fields="" -->
        </form>
    </div>
</template>

<script setup lang="ts">
import EMultiSelect from '@@/layers/ember/components/multiSelect/index.vue';
import type { AllRoles, Role } from '@@/shared/types/v1/role';
import { checkRole } from '@@/shared/utils/auth/role';

type InvitationSenderForm = {
    inviterRoles: AllRoles[] | undefined;
    loading?: boolean;
}

const hasValidRoles = computed(() => {
    if (props.inviterRoles) {
        return checkRole(props.inviterRoles, ['admin', 'clinician']);
    }
    return false;
});

const isAdmin = computed(() => {
    if (props.inviterRoles) {
        return checkRole(props.inviterRoles, ['admin']);
    }
    return false;
});

const presetInvitationOptions = [
    { label: 'Admin', value: 'admin', children: [
        { label: 'Owner', value: 'owner', parentRequired: true },
    ]},
    { label: 'Clinician', value: 'clinician', exclusiveKey: 'clinician-patient-group' },
    { label: 'Patient', value: 'patient', exclusiveKey: 'clinician-patient-group' },
];

const props = defineProps<InvitationSenderForm>();



const presetInvitation = ref<Role[] | undefined>(undefined);
</script>

<style lang="scss" scoped>
.invitation-sender-form {
    .preset-invitation-wrapper {
        margin-bottom: 1rem;

        .invitation-sender-form__preset-select {
            min-width: 150px;
        }
    }
}
</style>