import * as z from 'zod';



export const UUIDSchema = z.string().uuid();

export const BigIntSchema = z.union([
    z.string().regex(/^\d+$/),
    z.bigint(),
]).transform((val) => {
    return typeof val === 'string' ? parseInt(val, 10) : val;
});



export function validateUUID(value: string) {
    const parsedResult = UUIDSchema.safeParse(value);

    if (!parsedResult.success) {
        throw 'Invalid UUID format';
    }

    return parsedResult.data;
}