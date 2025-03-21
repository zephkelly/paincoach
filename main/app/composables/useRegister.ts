import { type UserRole } from "@@/shared/types/users";
import type { UserRegister, UserRegisterPartial } from "@@/shared/types/users/register";
import type { DBClinicianUserFields } from "@@/shared/types/users/clinician";
import { type MinimalUserInvitation } from "@@/shared/types/users/invitation";
import { type UserInviteDataPartial } from "@@/shared/types/users/invitation/create";

import { type DBClinicianUserFieldsPartial } from "@@/shared/types/users/clinician";

import { type DBEncryptedPatientMedicationDataV1Partial } from "@@/shared/types/users/medication/v1";

import { BASE_USER_INVITE_REGISTER_FIELDS, CLINICIAN_USER_INVITE_REGISTER_FIELDS, MEDICATION_FIELDS } from "@@/shared/types/users/register/fields";

import { validateUserRegister, validateUserRegisterPartial } from "@@/shared/schemas/user/register";



export const useRegister = () => {
    const inviteData = ref<MinimalUserInvitation | undefined>(undefined);

    const state = useState<{
        user: UserRegisterPartial,
        additional_profiles: {
            clinician: DBClinicianUserFieldsPartial,
        },
        wants_additional_profiles: UserRole[],
        medications: DBEncryptedPatientMedicationDataV1Partial[] | undefined,
    }>('base_user_registration_state', () => ({
        user: {
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
            specialisation: undefined,
            practice_name: undefined,
            abn: undefined,
    
            // Admin fields
            allowed_additional_profiles: undefined,
            additional_profiles: [],
        },
        additional_profiles: {
            clinician: {
                role: 'clinician',
                ahprah_registration_number: undefined,
                specialisation: undefined,
                practice_name: undefined,
                abn: undefined,
            }
        },
        wants_additional_profiles: [],
        medications: undefined,
    }));

    const medicationState = computed(() => state.value.medications);
    
    const wantsAdditionalClinicianProfile = computed(() => state.value.wants_additional_profiles.includes('clinician'));
    
    const willUseApplication = computed(() => state.value.user.will_use_app);

    
    
    // Medications ------------------------------------------------------------
    const takesMedication = ref<boolean>(false);

    function getMedicationFieldValues(field: keyof DBEncryptedPatientMedicationDataV1Partial, index: number) {
        const medications = state.value.medications;
        if (!medications) return undefined;

        const medication = medications[index];

        if (medication === undefined) return undefined;

        return medication[field];
    }

    function setMedicationFieldValues(field: keyof DBEncryptedPatientMedicationDataV1Partial, index: number, value: any) {
        console.log('Setting medication field:', field, 'to:', value);
        if (state.value.medications === undefined) {
            state.value.medications = []
        };

        const medication = state.value.medications[index];


        state.value.medications[index] = {
            ...medication,
            [field]: value
        };

        console.log(`Medication ${index} field ${field} updated to:`, value);
    }

    function addMedication() {
        if (state.value.medications === undefined) {
            state.value.medications = [];
        }

        state.value.medications.push({
            start_date: undefined,
            end_date: undefined,
            is_on_going: true,
            medication_name: undefined,
            dosage: undefined,
            reason: 'pain',
            frequency: undefined,

            notes: undefined,
        });
    }

    if (import.meta.client) {
        if (!state.value.medications || state.value.medications.length === 0)
        addMedication();
    }


    function setInviteData(invitation_registration_data: MinimalUserInvitation) {
        inviteData.value = invitation_registration_data;
    }

    watch(inviteData, (value) => {
        if (value === undefined) return;

        const registration_data: UserInviteDataPartial | undefined = value.registration_data;

        state.value.user.invitation_token = value.invitation_token;
        state.value.user.id = value.user_id;
        state.value.user.confirm_email = value.email; 
        
        state.value.user = {
            ...state.value.user,
            ...registration_data,
            
            //@ts-expect-error
            additional_profiles: undefined,
        }

        state.value.user.will_use_app = true;

        console.log('Invite data set:', state.value);
    }, { immediate: true });

    const registrationState = computed(() => state.value.user);

    const desiredUserRole = computed(() => state.value.user.role);

    const canRegisterAdditionalProfiles = computed<UserRole[]>(() => {
        if (state.value.user.role !== 'admin' || inviteData.value?.role !== 'admin') return [];
        
        return inviteData.value?.registration_data?.allowed_additional_profiles || [];
    });




    const fieldErrors = ref<UserRegisterPartial>({});

    const getFieldValue = (identifier: string) => {
        return state.value.user[identifier as keyof UserRegisterPartial];
    };
    
    const setFieldValue = (identifier: string, value: any) => {
        let validatedValue = value;

        state.value.user = {
            ...state.value.user,
            [identifier]: validatedValue
        };
    };

    const getAdditionalClinicianProfileFieldValue = (identifier: keyof DBClinicianUserFields) => {
        return state.value.additional_profiles.clinician[identifier];
    };

    const setAdditionalClinicianProfileFieldValue = (identifier: keyof DBClinicianUserFields, value: any) => {
        let validatedValue = value;

        state.value.additional_profiles.clinician = {
            ...state.value.additional_profiles.clinician,
            [identifier]: validatedValue
        };
    };

    const validatedRegistrationData = ref<UserRegister | undefined>(undefined);

    watch(state, () => {
        try {
            // Format medications array
            let medicationsArray: DBEncryptedPatientMedicationDataV1Partial[] = []

            if (takesMedication.value && state.value.medications !== undefined) {
                medicationsArray = state.value.medications;
            }

            let additionalProfilesArray = [];

            if (state.value.wants_additional_profiles.includes('clinician') && inviteData.value?.registration_data?.allowed_additional_profiles?.includes('clinician')) {
                additionalProfilesArray.push(state.value.additional_profiles.clinician);
            }

            // Combine registration data
            const registrationData: UserRegisterPartial = {
                ...state.value.user,

                additional_profiles: additionalProfilesArray,
                //@ts-expect-error
                medications: medicationsArray,
            }

            const validatedData = validateUserRegisterPartial(registrationData);

            const validatedData2 = validateUserRegister(registrationData);

            console.log('Post full validation:', validatedData2);

            validatedRegistrationData.value = validatedData2;
        }
        catch (error) {
            validatedRegistrationData.value = undefined;
            console.log(error);
        }
    }, { deep: true });

    const canSubmit = computed(() => validatedRegistrationData.value !== undefined);

    async function submitRegistration() {
        try {
            if (!canSubmit.value || validatedRegistrationData.value === undefined) {
                console.error('Invalid registration data');
                throw new Error('Invalid registration data');
            }

            const response = await $fetch('/api/v1/auth/register', {
                method: 'POST',
                body: validatedRegistrationData.value,
            });
        }
        catch(error) {
            console.error('Error submitting registration:', error);
        }
    }

    return {
        state,
        registrationState,
        medicationState,

        wantsAdditionalClinicianProfile,

        setInviteData,
        
        BASE_USER_INVITE_REGISTER_FIELDS,
        
        desiredUserRole,
        canRegisterAdditionalProfiles,
        willUseApplication,

        canSubmit,
        submitRegistration,
        
        getFieldValue,
        setFieldValue,
        
        //Medication
        MEDICATION_FIELDS,
        takesMedication,
        addMedication,
        getMedicationFieldValues,
        setMedicationFieldValues,
        
        CLINICIAN_USER_INVITE_REGISTER_FIELDS,
        getAdditionalClinicianProfileFieldValue,
        setAdditionalClinicianProfileFieldValue,
    }
}