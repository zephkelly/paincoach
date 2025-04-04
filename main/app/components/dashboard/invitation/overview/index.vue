<template>
    <DashboardInvitationOverviewList
        v-if="computedInvitations"
        :invitations="computedInvitations"
    />
</template>

<script lang="ts" setup>
import type { PaginatedResponse } from '@@/shared/types/pagination';
import type { BasicUserInvitation } from '@@/shared/types/v1/user/invitation/basic';
import { BasicUserInvitationValidator } from '@@/shared/schemas/v1/user/invitation/basic';


const { data: invitationsResponse } = await useFetch<PaginatedResponse<BasicUserInvitation>>('/api/v1/invitation')

const computedInvitations: ComputedRef<BasicUserInvitation[] | undefined> = computed(() => BasicUserInvitationValidator.validateArray(invitationsResponse.value?.data || []));
</script>