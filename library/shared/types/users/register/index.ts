import { z } from 'zod';
import { 
    UserRegisterSchema,
    UserRegisterPartialSchema,

    BaseUserRegisterPartialSchema,
    ClinicianRegisterPartialSchema,
    PatientRegisterPartialSchema,
    AdminRegisterPartialSchema
} from '@@/shared/schemas/user/register';



export type UserRegister = z.infer<typeof UserRegisterSchema>;
export type UserRegisterPartial = z.infer<typeof UserRegisterPartialSchema>;

export type BaseUserRegisterPartial = z.infer<typeof BaseUserRegisterPartialSchema>;
export type ClinicianRegisterPartial = z.infer<typeof ClinicianRegisterPartialSchema>;
export type PatientRegisterPartial = z.infer<typeof PatientRegisterPartialSchema>;
export type AdminRegisterPartial = z.infer<typeof AdminRegisterPartialSchema>;