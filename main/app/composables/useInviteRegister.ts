import { ZodError } from "zod";
import type { Role } from "@@/shared/types/v1/role";
import type { LimitedUserInvitation } from "@@/shared/types/v1/user/invitation/minimal";

import { debouncedComputed } from "@@/shared/utils/debounce/computed";

import {
    BASE_USER_INVITE_REGISTER_FIELDS,
    CLINICIAN_USER_INVITE_REGISTER_FIELDS,
    MEDICATION_FIELDS
} from "@@/shared/types/v1/user/registration/fields"


import type { UserRegisterPartial } from "@@/shared/types/v1/user/registration";
import { validateUserRegister } from "@@/shared/schemas/v1/user/registration";

import { DBUserRegistrationDataPartialSchema } from "@@/shared/schemas/v1/user/registration/data/index";

import type { CreateEncryptedPainMedicationDataV1RequestPartial } from "@@/shared/types/v1/medication/v1";
import {
    validateCreateEncryptedPainMedicationDataV1Request,

    validateCreateEncryptedPainMedicationDataV1RequestPartial,
    validateCreateEncryptedPainMedicationDataV1RequestsPartial
} from "@@/shared/schemas/v1/medication/v1";





export const useInviteRegister = (invitation: ComputedRef<LimitedUserInvitation | null>) => {
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
        public_id: invitation.value?.public_user_id,
        email: invitation.value?.email,
        phone_number: invitation.value?.phone_number,
        first_name: invitation.value?.invitation_data.first_name,
        last_name: invitation.value?.invitation_data.last_name,
        data_sharing_enabled: invitation.value?.invitation_data.data_sharing_enabled,
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

    const validatedRegistrationData = debouncedComputed(() => {
        if (!state.value) {
            return null;
        }

        try {
            const validatedData = validateUserRegister(state.value);
            console.log("Validated user register data", validatedData); 
            return validatedData;
        }
        catch (error: unknown) { }
            
        return null;
    }, 600);


    const isValid = ref(false);
    const formErrors = ref<Record<string, string>>({});
    // Validation function to call on blur or form submission
    function validate(fieldName?: string): boolean {
        if (!state.value) {
            isValid.value = false;
            return false;
        }
        
        try {
            // If a specific field is provided, we can validate just that field
            if (fieldName) {
                // Create an object with just the field to validate
                const fieldToValidate = { [fieldName]: (state.value as any)[fieldName] };
                
                try {
                    // This will throw if invalid
                    validateUserRegister({
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
            const validatedData = validateUserRegister(state.value);
            console.log(validatedData);
            formErrors.value = {}; // Clear previous errors
            isValid.value = true;
            return true;
        } catch (error: unknown) {
            console.log("Error validating user register data", error);
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


    // watch(state, (newState) => {
    //     if (!newState) {
    //         return; // Just return without a value, as watch callbacks don't use return values
    //     }
        
    //     try {
    //         const validatedData = validateUserRegister(newState);
    //         // Do something with the validated data if needed
    //         console.log("Data is valid:", validatedData);
    //     }
    //     catch (error: unknown) {
    //         console.log("Error validating user register data", error);
    //         if (error instanceof ZodError) {
    //             console.error("Error validating user register data", error);
    //         }
    //     }
    // }, { deep: true, immediate: true });


    const medicationsErrors = ref<Map<number, Map<string, string | undefined>>>(new Map(new Map()));

    function validateMedicationField(index: number, fieldValue: any, field: keyof CreateEncryptedPainMedicationDataV1RequestPartial) {
        try {
            validateCreateEncryptedPainMedicationDataV1RequestPartial({
                [field]: fieldValue
            });

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
        if (!state.value.medications) {
            state.value.medications = validateCreateEncryptedPainMedicationDataV1RequestsPartial([{}]);
            return;
        }

        state.value.medications.push(validateCreateEncryptedPainMedicationDataV1RequestPartial({}));
    }

    function removeMedication(index: number) {
        if (!state.value.medications) {
            return;
        }

        const confirmDelete = confirm("Are you sure you want to delete this medication?");
        if (!confirmDelete) {
            return;
        }

        state.value.medications.splice(index, 1);
    }


    const userFirstName = computed(() => state.value.first_name);

    return {
        state,

        BASE_USER_INVITE_REGISTER_FIELDS,
        userFirstName,

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
        validatedRegistrationData
    }
}