import type { MinimalUserInvitation } from "@@/shared/types/v1/user/invitation/minimal";

import {
    BASE_USER_INVITE_REGISTER_FIELDS,
    CLINICIAN_USER_INVITE_REGISTER_FIELDS,
    MEDICATION_FIELDS
} from "@@/shared/types/v1/user/registration/fields"

import type { UserRegisterPartial } from "@@/shared/types/v1/user/registration";
import type { DBEncryptedMedicationDataV1 } from "@@/shared/types/v1/medication/v1";


export const useRegister = () => {
    const inviteData = ref<MinimalUserInvitation | undefined>(undefined);

    function setInviteData(invitation_invitation_data: MinimalUserInvitation) {
        inviteData.value = invitation_invitation_data;
    }

    const invitedRoles = computed(() => {
        if (!inviteData.value) {
            return [];
        }

        return inviteData.value.roles;
    });



    const state = useState<UserRegisterPartial>('user-register-state', () => ({}));

    return {
        state,

        BASE_USER_INVITE_REGISTER_FIELDS,
        CLINICIAN_USER_INVITE_REGISTER_FIELDS,
        MEDICATION_FIELDS,

        setInviteData
    }
}