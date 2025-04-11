import { z } from "zod";



export const InputTypeSchema = z.enum([
    'text',
    'email',
    'phone',
    'date',
    'password',
    'number',
    'textarea',
    'select',
    'checkbox',
    'button',
]);