import { z } from 'zod';



export const UUIDSchema = z.string().uuid();

export function validateUUID(value: string) {
    try {
        return UUIDSchema.parse(value);
    } catch (error: any) {
        return error.errors;
    }
}