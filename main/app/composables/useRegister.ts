import type { UserRole } from "@@/shared/types/users";
import { type UserRegisterPartial } from "@@/shared/types/users/register";
import { validateUserRegister, validateUserRegisterPartial } from "@@/shared/schemas/user/register";



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

        private_data: undefined
    }));

    const desiredUserRole = computed(() => state.value.role);

    

    watch(state.value, (value) => {
        try {
            const validatedData = validateUserRegisterPartial(value);
            console.log('validated partial registration data', validatedData)

            if (validatedData.role === undefined) return;

            const validateFullData = validateUserRegister(validatedData);
            console.log('validated full registration data', validateFullData)
        }
        catch (error) {
            console.error(error);
        }
    }, { immediate: true, deep: true });

    return {
        state
    }
}