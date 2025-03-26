import {
    BASE_USER_INVITE_REGISTER_FIELDS,
    CLINICIAN_USER_INVITE_REGISTER_FIELDS,
    MEDICATION_FIELDS
} from "@@/shared/types/v1/user/registration/fields"

import type { UserRegisterPartial } from "@@/shared/types/v1/user/registration";
import type { CreateEncryptedPainMedicationDataV1RequestPartial } from "@@/shared/types/v1/medication/v1";
import {
    validateCreateEncryptedPainMedicationDataV1Request,

    validateCreateEncryptedPainMedicationDataV1RequestPartial,
    validateCreateEncryptedPainMedicationDataV1RequestsPartial
} from "@@/shared/schemas/v1/medication/v1";

import type { LimitedUserInvitation } from "@@/shared/types/v1/user/invitation/minimal";
import { ZodError } from "zod";



export const useInviteRegister = (invitation: ComputedRef<LimitedUserInvitation>) => {
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
        uuid: invitation.value.user_uuid,
        email: invitation.value.email,
        phone_number: invitation.value.phone_number,
        first_name: invitation.value.invitation_data.first_name,
        last_name: invitation.value.invitation_data.last_name,
        data_sharing_enabled: invitation.value.invitation_data.data_sharing_enabled,
        will_use_app: (invitation.value.primary_role === "patient") ? true : false,

        primary_role: invitation.value.primary_role,
        roles: invitation.value.roles,

        medications: undefined,
    }));

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
    }
}