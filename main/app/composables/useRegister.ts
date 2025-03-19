import { type UserRole } from "@@/shared/types/users";
import type { UserRegisterPartial } from "@@/shared/types/users/register";
import { type UserInvitation } from "@@/shared/types/users/invitation";
import { type UserInviteDataPartial } from "@@/shared/types/users/invitation/create";

import { BASE_USER_INVITE_REGISTER_FIELDS, CLINICIAN_USER_INVITE_REGISTER_FIELDS } from "@@/shared/types/users/register/fields";

import { validateUserRegisterPartial } from "@@/shared/schemas/user/register";



export const useRegister = () => {
    const inviteData = ref<UserInvitation | undefined>(undefined);

    const state = useState<UserRegisterPartial>('base_user_registration_state', () => ({
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

        will_use_app: undefined,
        medications: undefined,

        // Clinician fields
        ahprah_registration_number: undefined,
        specialisation: undefined,
        practice_name: undefined,
        business_address: undefined,
        abn: undefined,

        // Admin fields
        allowed_additional_profiles: undefined,
        additional_profiles: undefined,
    }));


    function setInviteData(invitation_registration_data: UserInvitation) {
        inviteData.value = invitation_registration_data;
    }

    const registrationState = computed(() => state.value);

    const desiredUserRole = computed(() => state.value.role);

    const canRegisterAdditionalProfiles = computed<UserRole[]>(() => {
        if (state.value.role !== 'admin' || inviteData.value?.role !== 'admin') return [];
        
        //@ts-expect-error
        return inviteData.value?.registration_data?.allowed_additional_profiles;
    });

    // function getAdditionalProfileFieldValues(profile: UserRole) {
    //     if (state.value.role !== 'admin' || inviteData.value?.role !== 'admin') return {};

    //     if (state.value.additional_profiles === undefined) return undefined;

    //     const additionalProfiles = state.value.additional_profiles;
    // }


    watch(inviteData, (value) => {
        if (value === undefined) return;

        const registration_data: UserInviteDataPartial | undefined = value.registration_data;

        state.value.invitation_token = value.invitation_token;
        state.value.id = value.user_id;
        state.value.confirm_email = value.email;
        
        if (value.role === 'patient') {
            state.value.will_use_app = true;
        }

        //@ts-expect-error
        state.value = {
            ...state.value,
            ...registration_data
        }

        console.log('Invite data set:', state.value);
    }, { immediate: true });


    const fieldErrors = ref<UserRegisterPartial>({});

    const getFieldValue = (identifier: string) => {
        return state.value[identifier as keyof UserRegisterPartial];
    };
    
    const setFieldValue = (identifier: string, value: any) => {
        let validatedValue = value;

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
        setInviteData,

        registrationState,

        BASE_USER_INVITE_REGISTER_FIELDS,
        CLINICIAN_USER_INVITE_REGISTER_FIELDS,

        desiredUserRole,
        canRegisterAdditionalProfiles,

        getFieldValue,
        setFieldValue,
    }
}