import { H3Error } from "h3";
import { ZodError } from "zod";
import type { Role } from "@@/shared/types/v1/role";
import type { LimitedUserInvitation } from "@@/shared/types/v1/user/invitation/limited";

import { debouncedComputed } from "@@/shared/utils/debounce/computed";

import {
    BASE_USER_INVITE_REGISTER_FIELDS,
    CLINICIAN_USER_INVITE_REGISTER_FIELDS,
    MEDICATION_FIELDS
} from "@@/shared/types/v1/user/registration/fields"

import type { UserRegisterPartial } from "@@/shared/types/v1/user/registration";

import { DBUserRegistrationDataPartialSchema } from "@@/shared/schemas/v1/user/registration/data/index";

import type { CreateEncryptedPainMedicationDataV1RequestPartial } from "@@/shared/types/v1/medication/v1";
import {
    encryptedPainMedicationDataV1RequestValidator,
} from "@@/shared/schemas/v1/medication/v1";

import { userRegisterValidator } from "@@/shared/schemas/v1/user/registration/index";




export const useInviteRegister = (invitation: ComputedRef<LimitedUserInvitation | null>) => {
    const submissionError = ref<string | null>(null);

    const invitedRoles = computed(() => {
        if (!invitation.value) {
            return [];
        }

        return invitation.value.roles;
    });

    const requiresMedicationRef = ref(false);

    const userRequiresMedication = computed({
        get() {
            if (invitedRoles.value.includes("patient")) {
                return true;
            }

            return requiresMedicationRef.value;
        },
        set(value: boolean) {
            if (invitedRoles.value.includes("patient")) {
                return;
            }

            requiresMedicationRef.value = value;
        }
    });
    
    const state = useState<UserRegisterPartial>('user-register-state', () => ({
        invitation_token: invitation.value?.invitation_token,

        public_id: invitation.value?.public_user_id,
        email: invitation.value?.email,
        phone_number: invitation.value?.phone_number,
        first_name: invitation.value?.invitation_data?.first_name,
        last_name: invitation.value?.invitation_data?.last_name,
        data_sharing_enabled: invitation.value?.invitation_data?.data_sharing_enabled,
        will_use_app: (invitation.value?.primary_role === "patient") ? true : false,

        primary_role: invitation.value?.primary_role,
        roles: invitation.value?.roles,

        medications: undefined,

        role_data: invitation.value?.roles.map((role) => {
            return DBUserRegistrationDataPartialSchema.parse({
                role: role
            })
        }) || []
    }));
 
    const computedState = computed(() => state.value);


    //role specific data
    function getRoleField<R extends Role, K extends string>(
        roleName: R, 
        fieldName: K
    ): any {
        const roleData = state.value.role_data?.find(data => data.role === roleName);
        
        return roleData ? (roleData as any)[fieldName] : undefined;
    }
      
    function setRoleField<R extends Role, K extends string>(
        roleName: R, 
        fieldName: K, 
        newValue: any
    ): void {
        const roleIndex = state.value.role_data?.findIndex(data => data.role === roleName);
        
        if (roleIndex !== undefined && roleIndex >= 0) {
          //@ts-expect-error
            state.value.role_data[roleIndex] = {
                ...state.value.role_data[roleIndex],
                [fieldName]: newValue
            };
        } else if (state.value.role_data) {
            state.value.role_data.push({
                role: roleName,
                [fieldName]: newValue
            } as any); // Type assertion needed
        } else {
            state.value.role_data = [{
                role: roleName,
                [fieldName]: newValue
            } as any]; // Type assertion needed
        }
    }

    const validatedRegistrationData = debouncedComputed(
        () => {
            if (!state.value) {
                return null;
            }

            submissionError.value = null;

            try {
                const validatedData = userRegisterValidator.validate(state.value);
                return validatedData;
            }
            catch (error: unknown) { }
                    
            return null;
        }, 
        [state.value],
        { wait: 500 }
    );


    const isValid = ref(false);
    const formErrors = ref<Record<string, string>>({});
    // Validation function to call on blur or form submission
    function validate(fieldName?: string): boolean {
        if (!state.value) {
            isValid.value = false;
            return false;
        }

        submissionError.value = null;

        try {
            // If a specific field is provided, we can validate just that field
            if (fieldName) {
                // Create an object with just the field to validate
                const fieldToValidate = { [fieldName]: (state.value as any)[fieldName] };
                
                try {
                    // This will throw if invalid
                    userRegisterValidator.validate({
                        ...state.value,
                        ...fieldToValidate
                    });
                    
                    // Field is valid, remove any existing error
                    if (formErrors.value[fieldName]) {
                        delete formErrors.value[fieldName];
                    }
                    
                    return true;
                } catch (error: unknown) {
                    if (error instanceof ZodError) {
                        // Find errors related to the specific field
                        const fieldErrors = error.errors.filter(err => err.path.includes(fieldName));
                        
                        if (fieldErrors.length > 0) {
                            formErrors.value[fieldName] = fieldErrors[0]?.message as string;
                        }
                    }
                    
                    return false;
                }
            }
            
            // Validate the entire form
            userRegisterValidator.validate(state.value);
            formErrors.value = {}; // Clear previous errors
            isValid.value = true;
            return true;
        } catch (error: unknown) {
            if (error instanceof ZodError) {
                // Map all errors to their respective fields
                formErrors.value = {};
                error.errors.forEach(err => {
                    const fieldPath = err.path.join('.');
                    formErrors.value[fieldPath] = err.message;
                });
            }
            
            isValid.value = false;
            return false;
        }
    }

    const medicationsErrors = ref<Map<number, Map<string, string | undefined>>>(new Map(new Map()));

    function validateMedicationField(index: number, fieldValue: any, field: keyof CreateEncryptedPainMedicationDataV1RequestPartial) {
        try {
            // validateCreateEncryptedPainMedicationDataV1RequestPartial({
            //     [field]: fieldValue
            // });
            encryptedPainMedicationDataV1RequestValidator.validatePartial({
                [field]: fieldValue
            })

            const thisMedicationsErrors = medicationsErrors.value.get(index);

            if (thisMedicationsErrors) {
                thisMedicationsErrors.delete(field);
                medicationsErrors.value.set(index, thisMedicationsErrors);
            }
        }
        catch (error: unknown) {
            if (error instanceof ZodError) {
                const painMedicationValidationError = error.errors[0]?.message;
                if (!painMedicationValidationError) {
                    console.error("Unknown error occurred while validating medication field");
                    return;
                }

                const thisMedicationsErrors = medicationsErrors.value.get(index);
                thisMedicationsErrors?.set(field, painMedicationValidationError || "");

                if (!thisMedicationsErrors) {
                    medicationsErrors.value.set(index, new Map([[field, painMedicationValidationError]]));
                }
                else {
                    medicationsErrors.value.set(index, thisMedicationsErrors);
                }
            }

            console.log(medicationsErrors.value)
        }
    }

    watch(() => state.value.medications, (newMedications, oldMedications) => {
        if (!newMedications || !oldMedications) {
            return;
        }

        newMedications.forEach((medication, index) => {
            if (!oldMedications[index]) {
                return;
            }
            if (medication.is_on_going) {
                if (!state.value.medications || !state.value.medications[index]) {
                    return;
                }

                state.value.medications[index].end_date = null;
            }
        });
    }, { deep: true });

    function addMedication() {
        try {
            if (!state.value.medications) {
                //@ts-expect-error -- The validator will fill in undefined default values
                state.value.medications = encryptedPainMedicationDataV1RequestValidator.validatePartialArray([{}]);
                console.log(state.value.medications);
                return;
            }
    
            const newMedication = encryptedPainMedicationDataV1RequestValidator.validatePartial({});
            //@ts-expect-error -- The is_on_going field will be set to true by default
            state.value.medications.push(newMedication);
        }
        catch (error) {
            console.error("Error adding medication:", error);
        }
    }

    function removeMedication(index: number) {
        if (!state.value.medications) {
            return;
        }

        const confirmDelete = confirm("Are you sure you want to delete this medication?");
        if (!confirmDelete) {
            return;
        }

        const previousMedications = state.value.medications;
        const splicedMedications = previousMedications.filter((_, i) => i !== index);

        state.value.medications = (splicedMedications.length > 0) ? splicedMedications : undefined;
    }

    const submitting = ref(false)
    async function submit() {
        if (submitting.value) {
            return;
        }

        submitting.value = true;
        try {
            let validatedData = await validatedRegistrationData.value;

            if (!validatedData) {
                validatedData = userRegisterValidator.validate(state.value);

                if (!validatedData) {
                    submissionError.value = "Sorry, an unexpected error has occurred and we cannot validate your data. Please refresh the page and try again.";
                    return;
                }
            }

            await $fetch('/api/v1/auth/invite/register', {
                method: 'POST',
                body: validatedData,
            })

            const {
                clearSession
            } = useAuth();

            await clearSession();
            await navigateTo('/dashboard/login');
        }
        catch (error) {
            console.error("Error during submission:", error);

            if (error instanceof H3Error) {
                submissionError.value = error.message
            }
            else {
                submissionError.value = "An unexpected error occurred during submission, please reach out to an administrator.";
            }
        }
        finally {
            submitting.value = false;
        }
    }

    return {
        state,
        computedState,

        BASE_USER_INVITE_REGISTER_FIELDS,

        MEDICATION_FIELDS,
        medicationsErrors,
        userRequiresMedication,
        validateMedicationField,
        addMedication,
        removeMedication,

        CLINICIAN_USER_INVITE_REGISTER_FIELDS,

        getRoleField,
        setRoleField,

        validate,
        validatedRegistrationData,

        submit,
        submitting,
        submissionError
    }
}