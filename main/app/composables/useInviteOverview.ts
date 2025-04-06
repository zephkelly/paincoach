import { type BasicUserInvitation } from "@@/shared/types/v1/user/invitation/basic";
import { BasicUserInvitationValidator } from "@@/shared/schemas/v1/user/invitation/basic";



export const useInviteOverview = async () => {
    const { data: invitationsResponse, refresh } = await useFetch<PaginatedResponse<BasicUserInvitation>>('/api/v1/invitation')
    
    const computedInvitations: ComputedRef<BasicUserInvitation[] | undefined> = computed(() => BasicUserInvitationValidator.validateArray(invitationsResponse.value?.data || []));

    return {
        data: computedInvitations,
        refresh
    }
}