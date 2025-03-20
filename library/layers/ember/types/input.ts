import { z } from "zod";
import { InputTypeSchema } from "../schemas/input";
import { AdminRegisterSchema, ClinicianRegisterSchema, PatientRegisterSchema } from "@@/shared/schemas/user/register";


export type InputType = z.infer<typeof InputTypeSchema>;

export type UserFieldKeys = 
  | keyof z.infer<typeof AdminRegisterSchema>
  | keyof z.infer<typeof ClinicianRegisterSchema>
  | keyof z.infer<typeof PatientRegisterSchema>;

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
