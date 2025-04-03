<template>
    <DashboardInvitationOverviewList
        v-if="invitationsResponse && invitationsResponse.data"
        :invitations="invitationsResponse?.data"
    />
</template>

<script lang="ts" setup>
import type { PaginatedResponse } from '#imports';
import type { BasicUserInvitation } from '@@/shared/types/v1/user/invitation/basic';


const { data: invitationsResponse } = await useFetch<PaginatedResponse<BasicUserInvitation>>('/api/v1/invitation')

const computedInvitations = computed(() => {
    return invitationsResponse.value?.data
})
</script>