import { z } from 'zod';



export const UUIDSchema = z.string().uuid();

export function validateUUID(value: string) {
    try {
        return UUIDSchema.parse(value);
    } catch (error: any) {
        return error.errors;
    }
}

export const BigIntIDSchema = z.union([
    z.string().regex(/^\d+$/, "ID must be a valid number string"),
    z.number().int().positive()
  ]).transform((val) => {
    // Always return a number
    return typeof val === 'string' ? parseInt(val, 10) : val;
});