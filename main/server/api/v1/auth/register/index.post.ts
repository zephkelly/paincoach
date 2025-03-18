import { z, ZodError } from 'zod';
import { createZodValidationError } from '~~lib/shared/utils/zod/error';
import { UserRoleSchema } from '@@/shared/schemas/user/base'
import { PatientUserPrivateDataSchema } from '@@/shared/schemas/user/patient/index'
import { onRequestValidateSession } from '~~/server/utils/auth/request-middleware/validate-session';

import { getPainCoachSession } from '~~/server/utils/auth/session/getSession';




const BaseRegisterUserRequestSchema = z.object({
    desired_user_role: UserRoleSchema,
    invitation_token: z.string(),

    password: z.string().optional(),
    confirm_password: z.string().optional(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    phone_number: z.string().optional(),
    email: z.string().optional(),
})

const ClinicianRegisterRequestSchema = BaseRegisterUserRequestSchema.extend({
    desired_user_role: z.literal('clinician'),

    ahprah_registration_number: z.string()
        .min(1, 'License number is required')
        .max(100, 'License number must be less than 100 characters')
        .optional(),

    specialisation: z.string()
        .max(100, 'Specialization must be less than 100 characters')
        .optional(),

    practice_name: z.string()
        .max(255, 'Practice name must be less than 255 characters')
        .optional(),

    business_address: z.string().optional(),

    abn: z.string().optional(),
})

const PatientRegisterRequestSchema = BaseRegisterUserRequestSchema.extend({
    desired_user_role: z.literal('patient'),

    private_data: PatientUserPrivateDataSchema.optional()
})

const AdminRegisterRequestSchema = BaseRegisterUserRequestSchema.extend({
    desired_user_role: z.literal('admin'),
})

const UserRegisterRequestSchema = z.discriminatedUnion('desired_user_role', [
    AdminRegisterRequestSchema,
    ClinicianRegisterRequestSchema,
    PatientRegisterRequestSchema
])

export type UserRegisterRequest = z.infer<typeof UserRegisterRequestSchema>;


export default defineEventHandler({
    onRequest: [
        (event) => onRequestValidateSession(event),
    ],
    handler: async (event) => {
        const {
            session,
            userSession,
            secureSession
        } = await getPainCoachSession(event);

        const body = await readBody<UserRegisterRequest>(event);

        try {
            const validatedRequest = UserRegisterRequestSchema.parse(body)


        }
        catch (error: unknown) {
            console.error('POST: /api/v1/auth/register:')
            if (error instanceof ZodError) {
                throw createZodValidationError(error);
            }
        }
    }
})