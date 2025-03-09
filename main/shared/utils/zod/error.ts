import { ZodError } from 'zod';

/**
 * Extracts field errors from a ZodError
 * @param error The ZodError to extract fields from
 * @param includeFirstErrorOnly Whether to include only the first error message per field
 * @returns An object with field names as keys and error messages as values
 */
export function extractZodErrors(error: ZodError, includeFirstErrorOnly = false): Record<string, string | string[]> {
    const formattedError = error.format();
    const fieldErrors: Record<string, string | string[]> = {};

    // Process the formatted error object
    Object.entries(formattedError).forEach(([field, fieldError]) => {
        // Skip the _errors at the root level
        //@ts-expect-error
        if (field !== '_errors' && fieldError._errors && fieldError._errors.length > 0) {
            // Either include just the first error message or all error messages
            fieldErrors[field] = includeFirstErrorOnly
                //@ts-expect-error
                ? fieldError._errors[0]
                //@ts-expect-error
                : fieldError._errors;
        }
    });

    return fieldErrors;
}

/**
 * Creates an H3 error response with Zod validation errors in the data field
 * @param error The ZodError to format
 * @param includeFirstErrorOnly Whether to include only the first error message per field
 * @returns H3 compatible error object
 */
export function createZodValidationError(error: ZodError, includeFirstErrorOnly = false) {
    const fieldErrors = extractZodErrors(error, includeFirstErrorOnly);

    return createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Validation failed',
        data: { fields: fieldErrors }
    });
}