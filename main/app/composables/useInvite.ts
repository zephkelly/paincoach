import type { Role } from "@@/shared/types/v1/role";
import { type MinimalUserInvitation } from "@@/shared/types/users/invitation/index";
import { validateMinimalUserInvitation } from "@@/shared/schemas/v1/user/invitation/minimal";



export const useInvite = () => {
    const state = useState<{
        fetching: boolean;
        invitation: MinimalUserInvitation | undefined | null;
    }>('invitation_form', () => ({
        fetching: false,
        invitation: null
    }));

    const invitation = computed(() => state.value.invitation);
    const loaded = computed(() => state.value.invitation !== null && state.value.invitation !== undefined && !state.value.fetching);
    const fetching = computed(() => state.value.fetching);

    const invitationComputed = computed(() => state.value.invitation);

    async function fetch(token?: string) {
        const query = token ? `?token=${token}` : '';
        try {
            const response = await $fetch<MinimalUserInvitation>('/api/v1/auth/invite' + query);
            const validatedUserInvitation = validateMinimalUserInvitation(response);
            
            state.value.invitation = validatedUserInvitation;
        }
        catch (error) {
            console.error(error);
        }
    }

    async function clear() {
        state.value.invitation = null
    }

    return {
        state,

        loaded,
        fetching,
        invitation: invitationComputed,

        fetch,
        clear
    }
}