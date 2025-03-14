import { ZodError } from 'zod';

/**
 * Extracts field errors from a ZodError
 * @param error The ZodError to extract fields from
 * @param includeFirstErrorOnly Whether to include only the first error message per field
 * @returns An object with field names as keys and error messages as values
 */
export function extractZodErrors(error: ZodError, includeFirstErrorOnly = false) {
    const formattedError = error.format();
    const fieldErrors: Record<string, string | string[]> = {};

    const errorObject = Object.entries(formattedError)[1]
    //@ts-expect-error
    const firstObject = errorObject[0]
    //@ts-expect-error
    const firstObjectError = errorObject[1]._errors[0]
    const errorString = firstObject + ': ' + firstObjectError

    return [errorString]
}

/**
 * Creates an H3 error response with Zod validation errors in the data field
 * @param error The ZodError to format
 * @param includeFirstErrorOnly Whether to include only the first error message per field
 * @returns H3 compatible error object
 */
export function createZodValidationError(error: ZodError, includeFirstErrorOnly = false) {
    const fieldErrors = extractZodErrors(error, includeFirstErrorOnly);

    console.log('Validation errors:', fieldErrors);

    if (import.meta.client) {
        throw new Error('Validation failed');
    }

    if (import.meta.dev) {
        return createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
            message: 'Validation failed',
            data: { errors: fieldErrors }
        });
    }

    else {
        return createError({
            statusCode: 500,
            statusMessage: 'Bad Request',
            message: 'Internal server validation failed, contact administrator.',
        });
    }
}