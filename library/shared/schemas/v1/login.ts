import { z } from "zod";
import { createSchemaValidator } from "@@/shared/utils/zod/new";



export const LoginSchema = z.object({
    email: z.string().min(1, 'Email is required')
        .max(255, 'Email must be less than 255 characters')
        .email('Email is not valid').nullable(),
    password: z.string().min(1, 'Password is required')
        .max(255, 'Password must be less than 255 characters').nullable(),
    remember_me: z.boolean().optional()
        .default(false),
});

export const LoginValidator = createSchemaValidator(LoginSchema);