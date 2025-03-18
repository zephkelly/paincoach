import { z } from "zod";
import { InputTypeSchema } from "../schemas/input";
import { UserRegisterSchema, AdminRegisterSchema, ClinicianRegisterSchema, PatientRegisterSchema } from "@@/shared/schemas/user/register";


export type InputType = z.infer<typeof InputTypeSchema>;

export type UserFieldKeys = 
  | keyof z.infer<typeof AdminRegisterSchema>
  | keyof z.infer<typeof ClinicianRegisterSchema>
  | keyof z.infer<typeof PatientRegisterSchema>;

export type InputField = {
    inputType: InputType;
    identifier: Exclude<UserFieldKeys, 'invitation_token'>;
    label: string;
    tabindex: number;
    required: boolean;
}
