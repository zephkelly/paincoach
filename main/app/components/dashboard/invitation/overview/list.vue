<template>
    <ul class="basic-invitation-list">
        <section class="list-column-headers">
            <div class="basic-invitation-column-header">
                <p>Email</p>
            </div>
            <div class="basic-invitation-column-header">
                <p>Roles</p>
            </div>
            <div class="basic-invitation-column-header">
                <p>Status</p>
            </div>
            <div class="basic-invitation-column-header">
                <p>Expires</p>
            </div>
        </section>
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

<style lang="scss" scoped>
.list-column-headers {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    padding: 0.5rem 0.25rem;

    p {
        font-size: 0.85rem;;
        color: var(--text-4-color);
    }
}
</style>