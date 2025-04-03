<template>
    <ul class="basic-invitation-list">
        <DashboardInvitationOverviewListItem
            v-for="invitation in invitations"
            :key="invitation.invitation_token"
            :invitation="invitation"
        />
    </ul>
</template>

<script lang="ts" setup>

import type { BasicUserInvitation } from '@@/shared/types/v1/user/invitation/basic';

type InvitationListProps = {
    invitations: BasicUserInvitation[];
}
const props = defineProps<InvitationListProps>();
</script>