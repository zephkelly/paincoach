import { type InputField } from "@@/layers/ember/types/input"
import type { DBClinicianUserData } from "@@/shared/types/v1/user/role/clinician/data"
import type { DBEncryptedMedicationDataV1 } from "@@/shared/types/v1/medication/v1"

import type { DBBaseInvitationUserDataPartial } from "@@/shared/types/v1/user/invitation/data"


export type UserInvitationField = InputField & {
    identifier: keyof DBBaseInvitationUserDataPartial | 'email' | 'confirm_email' | 'phone_number';
}
export const BASE_USER_INVITE_FIELDS: UserInvitationField[] = [
    {
        inputType: 'email',
        label: 'Email',
        identifier: 'email',
        tabindex: 1,
        required: true,
        readonly: true,
    },
    {
        inputType: 'email',
        label: 'Confirm Email',
        identifier: 'confirm_email',
        tabindex: 1,
        required: true,
        readonly: true,
    },
    {
        inputType: 'phone',
        label: 'Phone Number',
        identifier: 'phone_number',
        tabindex: 1,
        required: false,
        readonly: true,
    },
    {
        inputType: 'select',
        label: 'Title',
        identifier: 'title',
        tabindex: 1,
        required: false,
        default: undefined,
        row: 'title-first_name',
        options: [
            { label: 'No Title', value: null },
            { label: 'Mr', value: 'Mr' },
            { label: 'Mrs', value: 'Mrs' },
            { label: 'Miss', value: 'Ms' },
            { label: 'Dr', value: 'Dr' },
            { label: 'Prof', value: 'Prof' }
        ]
    },
    {
        inputType: 'text',
        label: 'First Name',
        identifier: 'first_name',
        tabindex: 1,
        required: true,
        row: 'title-first_name',
    },
    {
        inputType: 'text',
        label: 'Last Name',
        identifier: 'last_name',
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
        label: 'AHPRA Registration Number',
        identifier: 'ahpra_registration_number',
        tabindex: 1,
        required: true,
        placeholder: 'eg. PSY00000001',
    },
    {
        inputType: 'text',
        label: 'Specialisation',
        identifier: 'specialisation',
        tabindex: 1,
        required: true,
        default: 'physiotherapy',
        readonly: true,
    }
];