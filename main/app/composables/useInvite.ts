import type { UserRole } from "@@/shared/types/users";
import { type UserInvitation } from "@@/shared/types/users/invitation/index";
import { validateUserRegister, validateUserRegisterPartial } from "@@/shared/schemas/users/register";


export const useInvite = () => {
    const state = useState<{
        fetching: boolean;
        invitation: UserInvitation | undefined | null;
    }>('invitation_form', () => ({
        fetching: false,
        invitation: null
    }));

    const invitation = computed(() => state.value.invitation);
    const loaded = computed(() => state.value.invitation !== null && state.value.invitation !== undefined && !state.value.fetching);
    const fetching = computed(() => state.value.fetching);

    async function fetch(token?: string) {
        const query = token ? `?token=${token}` : '';
        try {
            const response = await $fetch<UserInvitation>('api/v1/auth/invite' + query);
            state.value.invitation = response;
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
        invitation,

        fetch,
        clear
    }
}