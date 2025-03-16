import { z } from 'zod';
import { createZodValidationError } from '@@/shared/utils/zod/error';



export const UUIDSchema = z.string().uuid();

export const BigIntIDSchema = z.union([
    z.string().regex(/^\d+$/, "ID must be a valid number string"),
    z.number().int().positive()
]).transform((val) => {
    return typeof val === 'string' ? parseInt(val, 10) : val;
});



export function validateUUID(value: string) {
    const parsedResult = UUIDSchema.safeParse(value);

    if (!parsedResult.success) {
        throw createZodValidationError(parsedResult.error);
    }

    return parsedResult.data;
}