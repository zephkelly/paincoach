import { type InputField } from "@@/layers/ember/types/input"
import type { DBClinicianUserData } from "@@/shared/types/v1/user/role/clinician/data"
import type { DBEncryptedMedicationDataV1 } from "@@/shared/types/v1/medication/v1"

import type { UserRegisterPartial } from ".";


export type RegisterInputField = InputField & {
    identifier: keyof UserRegisterPartial;
}
export const BASE_USER_INVITE_REGISTER_FIELDS: RegisterInputField[] = [
    {
        inputType: 'email',
        label: 'Email',
        identifier: 'email',
        tabindex: 1,
        required: true,
        readonly: true,
    },
    {
        inputType: 'phone',
        label: 'Phone Number',
        identifier: 'phone_number',
        tabindex: 1,
        required: true,
        readonly: true,
    },
    {
        inputType: 'select',
        label: 'Title',
        identifier: 'title',
        tabindex: 1,
        required: true,
        default: null,
        options: [
            { label: 'Prof', value: 'Prof' },
            { label: 'Dr', value: 'Dr' },
            { label: 'Mr', value: 'Mr' },
            { label: 'Mrs', value: 'Mrs' },
            { label: 'Miss', value: 'Ms' },
            { label: 'No Title', value: null }
        ]
    },
    {
        inputType: 'text',
        label: 'First Name',
        identifier: 'first_name',
        tabindex: 1,
        required: true,
    },
    {
        inputType: 'text',
        label: 'Last Name',
        identifier: 'last_name',
        tabindex: 1,
        required: true,
    },
    {
        inputType: 'password',
        label: 'Password',
        identifier: 'password',
        tabindex: 1,
        required: true,
    },
    {
        inputType: 'password',
        label: 'Confirm Password',
        identifier: 'confirm_password',
        tabindex: 1,
        required: true,
    },
    {
        inputType: 'checkbox',
        label: 'Would you like to anonymously share your data to help improve our services?',
        identifier: 'data_sharing_enabled',
        tabindex: 1,
        required: false,
    }
];


export type ClinicianRegisterInputField = InputField & {
    identifier: keyof DBClinicianUserData;
}
export const CLINICIAN_USER_INVITE_REGISTER_FIELDS: ClinicianRegisterInputField[] = [
    {
        inputType: 'text',
        label: 'AHPRHA Registration Number',
        identifier: 'ahprah_registration_number',
        tabindex: 1,
        required: true,
        placeholder: 'eg. MED0123456789',
    },
    {
        inputType: 'text',
        label: 'Specialisation',
        identifier: 'specialisation',
        tabindex: 1,
        required: true,
        default: 'physiotherapy',
        readonly: true,
    },
    {
        inputType: 'text',
        label: 'Practice Name',
        identifier: 'practice_name',
        tabindex: 1,
        required: false,
    },
    {
        inputType: 'text',
        label: 'ABN',
        identifier: 'abn',
        tabindex: 1,
        required: false,
    }
];

type MedicalInputField = InputField & {
    identifier: keyof DBEncryptedMedicationDataV1;
}
export const MEDICATION_FIELDS: {
    base: MedicalInputField[]
} = {
    base: [
        {
            inputType: 'text',
            label: 'Medication Name',
            identifier: 'medication_name',
            tabindex: 1,
            required: true,
        },
        {
            inputType: 'text',
            label: 'Dosage',
            identifier: 'dosage',
            tabindex: 1,
            required: true,
        },
        {
            inputType: 'number',
            label: 'Frequency',
            identifier: 'frequency',
            tabindex: 1,
            required: true,
            placeholder: 'in hours (eg. 6 = every 6 hours)',
        }
    ]
}