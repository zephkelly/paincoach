import type { Role } from "@@/shared/types/v1/role";
import { type LimitedUserInvitation } from "@@/shared/types/v1/user/invitation/minimal";
import { validateLimitedUserInvitation } from "@@/shared/schemas/v1/user/invitation/limited";



export const useInvite = async () => {
    const {
        data: invitationData,
        status: invitationStatus,
        error: invitationError,
    } = await useFetch('/api/v1/auth/invite');

    const invitation = computed(() => {
        if (invitationStatus.value !== 'success') {
            return null;
        }

        return validateLimitedUserInvitation(invitationData.value)
    });
    const loaded = computed(() => invitation !== null && invitation !== undefined);
    const fetching = computed(() => invitationStatus.value === 'pending');

    const error = computed(() => {
        if (invitationStatus.value !== 'error') {
            return null;
        }
        if (invitationError.value) {
            console.log(invitationError.value);
            return invitationError.value;
        }
        return new Error('Unknown error');
    });

    // Computed invitation information
    const inviterFirstName = computed(() => invitation.value?.inviter_name);
    const inviterProfileImageUrl = computed(() => invitation.value?.inviter_profile_url);

    const inviteeFirstName = computed(() => invitation.value?.invitation_data.first_name);
    const inviteeRoles = computed(() => invitation.value?.roles);
    const inviteePrimaryRole = computed(() => invitation.value?.primary_role);
    const inviteeAdditionalRoles = computed(() => invitation.value?.roles.filter((role: Role) => role !== invitation.value?.primary_role));


    return {
        invitation,
        loaded,
        fetching,

        inviterFirstName,
        inviterProfileImageUrl,

        inviteeFirstName,
        inviteeRoles,
        inviteePrimaryRole,
        inviteeAdditionalRoles,
    }
}