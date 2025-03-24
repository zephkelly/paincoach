import type { MinimalUserInvitation } from "@@/shared/types/v1/user/invitation/minimal";

import {
    BASE_USER_INVITE_REGISTER_FIELDS,
    CLINICIAN_USER_INVITE_REGISTER_FIELDS,
    MEDICATION_FIELDS
} from "@@/shared/types/v1/user/registration/fields"



export const useRegister = () => {
    const inviteData = ref<MinimalUserInvitation | undefined>(undefined);

    function setInviteData(invitation_registration_data: MinimalUserInvitation) {
        inviteData.value = invitation_registration_data;
    }


    return {
        BASE_USER_INVITE_REGISTER_FIELDS,
        CLINICIAN_USER_INVITE_REGISTER_FIELDS,
        MEDICATION_FIELDS,

        setInviteData
    }
}