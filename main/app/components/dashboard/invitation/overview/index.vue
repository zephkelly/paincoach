<template>
    <DashboardInvitationOverviewList
        v-if="data"
        :invitations="data"
    />
</template>

<script lang="ts" setup>
// import type { PaginatedResponse } from '@@/shared/types/pagination';
// import type { BasicUserInvitation } from '@@/shared/types/v1/user/invitation/basic';
// import { BasicUserInvitationValidator } from '@@/shared/schemas/v1/user/invitation/basic';

const {
    data,
} = await useInviteOverview()


</script>