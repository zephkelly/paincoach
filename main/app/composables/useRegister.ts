import { type UserRole } from "@@/shared/types/users";
import type { UserRegisterPartial } from "@@/shared/types/users/register";
import { type UserInvitation } from "@@/shared/types/users/invitation";
import { type UserInviteDataPartial } from "@@/shared/types/users/invitation/create";

import { type DBClinicianSpecialisations } from "@@/shared/types/users/clinician";

import { type DBEncryptedPatientMedicationDataV1Partial } from "@@/shared/types/users/medication/v1";

import { BASE_USER_INVITE_REGISTER_FIELDS, CLINICIAN_USER_INVITE_REGISTER_FIELDS, MEDICATION_FIELDS } from "@@/shared/types/users/register/fields";

import { validateUserRegister, validateUserRegisterPartial } from "@@/shared/schemas/user/register";



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

        will_use_app: true,
        medications: undefined,

        // Clinician fields
        ahprah_registration_number: undefined,
        specialisation: 'physiotherapy' as DBClinicianSpecialisations,
        practice_name: undefined,
        abn: undefined,

        // Admin fields
        allowed_additional_profiles: undefined,
        additional_profiles: undefined,
    }));


    // Medications ------------------------------------------------------------
    const takesMedication = ref<boolean>(false);
    const medicationsState = ref<Exclude<DBEncryptedPatientMedicationDataV1Partial, 'reason'>[]>([]);
    const currentMedicationsState = computed(() => medicationsState.value);

    function getMedicationFieldValues(field: keyof DBEncryptedPatientMedicationDataV1Partial, index: number) {
        const medication = medicationsState.value[index];

        if (medication === undefined) return undefined;

        return medication[field];
    }

    function setMedicationFieldValues(field: keyof DBEncryptedPatientMedicationDataV1Partial, index: number, value: any) {
        const medication = medicationsState.value[index];

        if (medication === undefined) return;

        medicationsState.value[index] = {
            ...medication,
            [field]: value
        };

        console.log(`Medication ${index} field ${field} updated to:`, value);
    }

    function addMedication() {
        medicationsState.value.push({
            start_date: undefined,
            end_date: undefined,
            is_on_going: true,
            medication_name: undefined,
            dosage: undefined,
            frequency: undefined,

            notes: undefined,
        });
    }

    addMedication();


    function setInviteData(invitation_registration_data: UserInvitation) {
        inviteData.value = invitation_registration_data;
    }

    const registrationState = computed(() => state.value);

    const desiredUserRole = computed(() => state.value.role);

    const canRegisterAdditionalProfiles = computed<UserRole[]>(() => {
        if (state.value.role !== 'admin' || inviteData.value?.role !== 'admin') return [];
        
        return inviteData.value?.registration_data?.allowed_additional_profiles || [];
    });

    const willUseApplication = computed(() => state.value.will_use_app);

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
        
        state.value = {
            ...state.value,
            ...registration_data,
            allowed_additional_profiles: undefined,

            //@ts-expect-error
            additional_profiles: undefined,
        }

        state.value.will_use_app = true;

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

    watch([state, medicationsState], () => {
        try {
            const validatedData = validateUserRegisterPartial(state.value);

            console.log('Validated data:', validatedData);
            console.log('original data:', state.value);

            if (validatedData.role === undefined) return;

            const allowedAdditionalRoles = inviteData.value?.registration_data?.allowed_additional_profiles;

            const allowedRole = (allowedAdditionalRoles && allowedAdditionalRoles.length >= 1) ? allowedAdditionalRoles[0] : undefined;

            const newMedicationsArray = medicationsState.value.map((medication) => {
                return {
                    encrypted_medication_data: {
                        version: 1,
                        data: medication,
                    }
                }
            }) || undefined;

            console.log('New medications array:', newMedicationsArray);

            let newValue  = {
                ...state.value,
                allowed_additional_profiles: allowedAdditionalRoles,
                additional_profiles: [{
                        role: allowedRole,
                        // @ts-expect-error
                        ahprah_registration_number: state.value.ahprah_registration_number,
                        // @ts-expect-error
                        specialisation: state.value.specialisation,
                        // @ts-expect-error
                        practice_name: state.value.practice_name,
                        // @ts-expect-error
                        abn: state.value.abn,
                    }
                ],
                medications: newMedicationsArray,
            }

            console.log('New value:', newValue);

            const validatedData2 = validateUserRegister(newValue);

            console.log('Validated data 2:', validatedData2);
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
        willUseApplication,
        
        getFieldValue,
        setFieldValue,
        
        
        //Medication
        MEDICATION_FIELDS,
        currentMedicationsState,
        takesMedication,
        addMedication,
        getMedicationFieldValues,
        setMedicationFieldValues,
    }
}