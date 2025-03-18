import { type InputField } from "@@/layers/ember/types/input"



export const BASE_USER_INVITE_REGISTER_FIELDS: InputField[] = [
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
        label: 'Data Sharing Enabled',
        identifier: 'data_sharing_enabled',
        tabindex: 1,
        required: false,
    },
];

export const CLINICIAN_USER_INVITE_REGISTER_FIELDS: InputField[] = [
    {
        inputType: 'text',
        label: 'AHPRHA Registration Number',
        identifier: 'ahprah_registration_number',
        tabindex: 1,
        required: true,
    },
    {
        inputType: 'text',
        label: 'Specialisation',
        identifier: 'specialisation',
        tabindex: 1,
        required: false,
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
        label: 'Business Address',
        identifier: 'business_address',
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