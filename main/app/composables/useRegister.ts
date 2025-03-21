import { type UserRole } from "@@/shared/types/users";
import type { UserRegisterPartial } from "@@/shared/types/users/register";
import type { DBClinicianUserFieldsSchema } from "@@/shared/schemas/user/clinician";
import { type UserInvitation } from "@@/shared/types/users/invitation";
import { type UserInviteDataPartial } from "@@/shared/types/users/invitation/create";

import { type DBClinicianUserFieldsPartial } from "@@/shared/types/users/clinician";

import { type DBEncryptedPatientMedicationDataV1Partial } from "@@/shared/types/users/medication/v1";

import { BASE_USER_INVITE_REGISTER_FIELDS, CLINICIAN_USER_INVITE_REGISTER_FIELDS, MEDICATION_FIELDS } from "@@/shared/types/users/register/fields";

import { validateUserRegister, validateUserRegisterPartial } from "@@/shared/schemas/user/register";



export const useRegister = () => {
    const inviteData = ref<UserInvitation | undefined>(undefined);

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




    // Medications ------------------------------------------------------------
    const takesMedication = ref<boolean>(false);
    // const currentMedicationsState = computed(() => state.value.medications);

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


    function setInviteData(invitation_registration_data: UserInvitation) {
        inviteData.value = invitation_registration_data;
    }

    const registrationState = computed(() => state.value.user);

    const desiredUserRole = computed(() => state.value.user.role);

    const canRegisterAdditionalProfiles = computed<UserRole[]>(() => {
        if (state.value.user.role !== 'admin' || inviteData.value?.role !== 'admin') return [];
        
        return inviteData.value?.registration_data?.allowed_additional_profiles || [];
    });

    const willUseApplication = computed(() => state.value.user.will_use_app);

    // function getAdditionalProfileFieldValues(profile: UserRole) {
    //     if (state.value.role !== 'admin' || inviteData.value?.role !== 'admin') return {};

    //     if (state.value.additional_profiles === undefined) return undefined;

    //     const additionalProfiles = state.value.additional_profiles;
    // }


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
        
        console.log(`Field ${identifier} updated to:`, validatedValue);
        console.log('Current field errors:', fieldErrors.value);
    };

    watch(state, () => {
        try {
            // Format medications array
            let medicationsArray: DBEncryptedPatientMedicationDataV1Partial[] = []

            if (takesMedication.value && state.value.medications !== undefined) {
                medicationsArray = state.value.medications;
                console.log('medicationsArray:', medicationsArray);
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

            console.log('Pre-validated data:', registrationData);

            const validatedData = validateUserRegisterPartial(registrationData);

            console.log('Post partial validation:', validatedData);


            console.log('Pre-full validated data:', registrationData);

            const validatedData2 = validateUserRegister(registrationData);

            console.log('Post full validation:', validatedData2);

            // console.log('Validated data:', validatedData);
            // console.log('original data:', state.value);

            // if (validatedData.role === undefined) return;

            // const allowedAdditionalRoles = inviteData.value?.registration_data?.allowed_additional_profiles;

            // const allowedRole = (allowedAdditionalRoles && allowedAdditionalRoles.length >= 1) ? allowedAdditionalRoles[0] : undefined;

            // console.log(state.value.medications);
            

            // console.log('New medications array:', medicationsArray);

            // let newValue  = {
            //     ...state.value,
            //     allowed_additional_profiles: allowedAdditionalRoles,
            //     additional_profiles: [{
            //             role: allowedRole,
            //             // @ts-expect-error
            //             ahprah_registration_number: state.value.additional.ahprah_registration_number,
            //             // @ts-expect-error
            //             specialisation: state.value.specialisation,
            //             // @ts-expect-error
            //             practice_name: state.value.practice_name,
            //             // @ts-expect-error
            //             abn: state.value.abn,
            //         }
            //     ],
            //     medications: medicationsArray,
            // }

            // console.log('New value:', newValue);

            // const validatedData2 = validateUserRegister(newValue);

            // console.log('Validated data 2:', validatedData2);
        }
        catch (error) {
            console.error(error);
        }
    }, { deep: true });

    return {
        state,
        registrationState,
        medicationState,

        wantsAdditionalClinicianProfile,

        setInviteData,
        
        BASE_USER_INVITE_REGISTER_FIELDS,
        CLINICIAN_USER_INVITE_REGISTER_FIELDS,
        
        desiredUserRole,
        canRegisterAdditionalProfiles,
        willUseApplication,
        
        getFieldValue,
        setFieldValue,
        
        
        //Medication
        MEDICATION_FIELDS,
        takesMedication,
        addMedication,
        getMedicationFieldValues,
        setMedicationFieldValues,
    }
}