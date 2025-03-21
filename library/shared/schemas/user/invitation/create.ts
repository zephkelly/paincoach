import { z } from 'zod';
import { createZodValidationError } from '@@/shared/utils/zod/error';

import { DBAdminUserFieldsSchema } from '../admin';
import { DBClinicianUserFieldsSchema } from '../clinician';
import { BaseDBUserSchema, UserRoleSchema } from '@@/shared/schemas/user/base';
import { MockUserDataSchema } from '@@/shared/schemas/user/mock';



export const BaseUserInviteSchema = BaseDBUserSchema.pick({
    email: true,
    phone_number: true,
    first_name: true,
    last_name: true,
    data_sharing_enabled: true,
}).extend({
    confirm_email: z.string().email(),
    allowed_additional_profiles: z.array(UserRoleSchema).optional(),
});

const AdminInviteSchema = BaseUserInviteSchema.extend({
    ...DBAdminUserFieldsSchema.shape,
    
    allowed_additional_profiles: z.array(UserRoleSchema).optional(),
});

const AdminInvitePartialSchema = AdminInviteSchema.partial().extend({
    role: z.literal('admin')
})

const ClinicianInviteSchema = BaseUserInviteSchema.extend({
    ...DBClinicianUserFieldsSchema.shape,
});

const ClinicianInvitePartialSchema = ClinicianInviteSchema.partial().extend({
    role: z.literal('clinician'),
})


const PatientInviteSchema = BaseUserInviteSchema.extend({
    role: z.literal('patient'),
});

const PatientInvitePartialSchema = PatientInviteSchema.partial().extend({
    role: z.literal('patient'),
})


export const UserInviteDataSchema = z.discriminatedUnion('role', [AdminInviteSchema, ClinicianInviteSchema, PatientInviteSchema]);

export const UserInviteDataPartialSchema = z.discriminatedUnion('role', [AdminInvitePartialSchema, ClinicianInvitePartialSchema, PatientInvitePartialSchema]);


export const InviteUserRequestSchema = z.object({
    user: UserInviteDataSchema,
    mock: MockUserDataSchema.partial().optional(),
}).refine((data) => {
    return data.user.email === data.user?.confirm_email;
}, {
    message: 'Email and confirm email do not match',
});


export function validateInviteUserRequest(data: unknown) {
    const parsedResult = InviteUserRequestSchema.safeParse(data)

    if (!parsedResult.success) {
        throw createZodValidationError(parsedResult.error)
    }

    return parsedResult.data
}