import type { UserRole } from "@@/shared/types/users";
import { type UserRegisterPartial } from "@@/shared/types/users/register";
import { validateUserRegister, validateUserRegisterPartial } from "@@/shared/schemas/users/register";


export const useRegister = () => {
    const state = useState<UserRegisterPartial>('registration_form', () => ({
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
        data_sharing_enabled: false,

        // Clinician fields
        ahprah_registration_number: undefined,
        specialisation: undefined,
        practice_name: undefined,
        business_address: undefined,
        abn: undefined,
    }));

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