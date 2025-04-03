<template>
    <li class="basic-invitation-list-item">
        {{ invitation }}
    </li>
</template>

<script lang="ts" setup>
import type { BasicUserInvitation } from '@@/shared/types/v1/user/invitation/basic';

type InvitationListItemProps = {
    invitation: BasicUserInvitation;
}

const props = defineProps<InvitationListItemProps>();
</script>