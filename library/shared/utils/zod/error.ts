import { ZodError } from 'zod';


/**
 * Recursively extracts field error messages from Zod format output
 * @param errors The Zod formatted error object
 * @param path Current path in the object, used for recursion
 * @param result Object to collect the field/error pairs
 * @param includeFirstErrorOnly Whether to include only the first error message per field
 */
function extractZodErrors(
    errors: Record<string, any>,
    path = '',
    result: Record<string, string[]> = {},
    includeFirstErrorOnly = false
  ) {
    // Skip processing if the errors object is null or undefined
    if (!errors) return result;
  
    for (const [key, value] of Object.entries(errors)) {
      // Skip the _errors property which we'll handle separately
      if (key === '_errors') continue;
      
      const currentPath = path ? `${path}.${key}` : key;
      
      // If the value has _errors array, add it to our results
      if (value._errors && value._errors.length > 0) {
        result[currentPath] = includeFirstErrorOnly ? [value._errors[0]] : value._errors;
      }
      
      // Recursively process nested objects
      if (typeof value === 'object' && value !== null) {
        extractZodErrors(value, currentPath, result, includeFirstErrorOnly);
      }
    }
    
    // Handle top-level errors
    if (errors._errors && errors._errors.length > 0) {
      result[path || 'root'] = includeFirstErrorOnly ? [errors._errors[0]] : errors._errors;
    }
    
    return result;
  }

/**
 * Creates an H3 error response with Zod validation errors in the data field
 * @param error The ZodError to format
 * @param includeFirstErrorOnly Whether to include only the first error message per field
 * @returns H3 compatible error object
 */
export function createZodValidationError(error: ZodError, includeFirstErrorOnly = false) {
    const fieldErrors = error.format();

    const formattedErrors = extractZodErrors(fieldErrors, '', {}, includeFirstErrorOnly);

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