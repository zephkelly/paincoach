import { z } from "zod";
import { InputTypeSchema } from "../schemas/input";

import { DBOwnerUserRegistrationDataSchema } from "@@/shared/schemas/v1/user/role/owner/register";
import { DBAdminUserRegistrationDataSchema } from "@@/shared/schemas/v1/user/role/admin/register";
import { DBClinicianUserRegistrationDataSchema } from "@@/shared/schemas/v1/user/role/clinician/register";
import { DBPatientUserRegistrationDataSchema } from "@@/shared/schemas/v1/user/role/patient/register";


export type InputType = z.infer<typeof InputTypeSchema>;

export type UserFieldKeys = 
    | keyof z.infer<typeof DBOwnerUserRegistrationDataSchema>
    | keyof z.infer<typeof DBAdminUserRegistrationDataSchema>
    | keyof z.infer<typeof DBClinicianUserRegistrationDataSchema>
    | keyof z.infer<typeof DBPatientUserRegistrationDataSchema>;

export type InputField = {
    inputType: InputType;
    identifier: string;
    label: string;
    tabindex: number;
    required: boolean;
    readonly?: boolean;
    default?: any;
    placeholder?: string;
}

export type InputProps = {
    id: string;
    modelValue: any;
    required: boolean;
    label?: string;
    disabled?: boolean;
    readonly?: boolean;
    default?: any;
    placeholder?: string;
    tabindex?: number;
}
