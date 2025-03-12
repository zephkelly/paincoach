import { z } from 'zod';
import { createZodValidationError } from '@@/shared/utils/zod/error';

import { BaseDBUserSchema } from '@@/shared/schemas/users/base';
import { MockUserDataSchema } from '@@/shared/schemas/users/mock';



const BaseUserFieldsSchema = BaseDBUserSchema.pick({
    email: true,
    phone_number: true,
    first_name: true,
    last_name: true,
    data_sharing_enabled: true
}).extend({
    confirm_email: z.string().email(),
});

const AdminInviteSchema = BaseUserFieldsSchema.extend({
    role: z.literal('admin'),
});

const ClinicianInviteSchema = BaseUserFieldsSchema.extend({
    role: z.literal('clinician'),
    ahprah_registration_number: z.string(),
    specialisation: z.string().optional(),
    practice_name: z.string().optional(),
    business_address: z.string().optional(),
    abn: z.string().optional(),
});

const PatientInviteSchema = BaseUserFieldsSchema.extend({
    role: z.literal('patient'),
});

//add a refine to make sure the confirm email matches the email
export const InviteUserRequestSchema = z.object({
    user: z.discriminatedUnion('role', [
        AdminInviteSchema,
        ClinicianInviteSchema,
        PatientInviteSchema,
    ]),
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