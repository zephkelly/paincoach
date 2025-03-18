import { type UserRegisterPartial } from "@@/shared/types/users/register";
import { type UserInvitation } from "@@/shared/types/users/invitation";

import { BASE_USER_INVITE_REGISTER_FIELDS } from "@@/shared/types/users/register/fields";


import { validateUserRegisterPartial } from "@@/shared/schemas/user/register";



export const useRegister = () => {
    const state = useState<UserRegisterPartial>('user_registration_state', () => ({
        invitation_token: undefined,

        id: undefined,
        profile_url: undefined,
        email: undefined,
        confirm_email: undefined,
        password: undefined,
        confirm_password: undefined,
        role: undefined,
        first_name: undefined,
        last_name: undefined,
        phone_number: undefined,
        data_sharing_enabled: undefined,

        // Clinician fields
        ahprah_registration_number: undefined,
        specialisation: undefined,
        practice_name: undefined,
        business_address: undefined,
        abn: undefined,

        will_use_app: undefined,
    }));

    const registrationState = computed(() => state.value);

    const desiredUserRole = computed(() => state.value.role);

    function setInviteData(invitation_registration_data: UserInvitation) {
        if (invitation_registration_data.role === 'patient') {
            state.value.will_use_app = true;
        }

        const registration_data = invitation_registration_data.registration_data || {};
        
        state.value = {
            ...state.value,
            invitation_token: invitation_registration_data.invitation_token,
            id: invitation_registration_data.user_id,
            confirm_email: invitation_registration_data.email,
            ...registration_data
        }

        console.log('Invite data set:', state.value);
    }

    const fieldErrors = ref<UserRegisterPartial>({});

    const getFieldValue = (identifier: string) => {
        return state.value[identifier as keyof UserRegisterPartial];
    };
    
    const setFieldValue = (identifier: string, value: any) => {
        // Here you can add your verification logic
        let validatedValue = value;

        // Update the state with the validated value
        state.value = {
            ...state.value,
            [identifier]: validatedValue
        };
        
        console.log(`Field ${identifier} updated to:`, validatedValue);
        console.log('Current field errors:', fieldErrors.value);
    };

    watch(state, (value) => {
        try {
            const validatedData = validateUserRegisterPartial(value);

            if (validatedData.role === undefined) return;
        }
        catch (error) {
            console.error(error);
        }
    }, { immediate: true, deep: true });

    return {
        state,
        setInviteData,

        registrationState,

        BASE_USER_INVITE_REGISTER_FIELDS,

        desiredUserRole,

        getFieldValue,
        setFieldValue,
    }
}