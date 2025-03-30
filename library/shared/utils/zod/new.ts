import { z } from 'zod';
// import { H3Error } from 'h3';

/**
 * CustomZodError extends the standard ZodError with additional functionality
 * for formatting errors to match schema structure exactly.
 */
class CustomZodError extends z.ZodError {
  /**
   * Creates a formatted error object that exactly matches the schema structure
   * with error messages at the appropriate paths.
   */
  formatToSchema<T extends z.ZodType>(schema: T): any {
    // Get the standard formatted error
    const formatted = this.format();
    
    // Create a structure that matches the schema shape
    return this.buildErrorStructure(formatted, schema);
  }
  
  /**
   * Extracts error message for a specific field path
   * @param path The dot-notation path to the field
   * @returns The error message string or null if no error
   */
  getFieldError(path: string): string | null {
    const parts = path.split('.');
    const formatted = this.format();
    
    // Navigate through the formatted error object following the path
    let current: any = formatted;
    for (const part of parts) {
      if (!current[part]) {
        return null; // Path doesn't exist in errors
      }
      current = current[part];
    }
    
    // Check if we have errors at this level
    if (current._errors?.length) {
      return current._errors[0];
    }
    
    // If we reached a leaf node with no _errors, check for nested errors
    return this.extractFirstErrorMessage(current);
  }
  
  /**
   * Extracts the first error message from a nested error object
   */
  private extractFirstErrorMessage(obj: any): string | null {
    if (!obj || typeof obj !== 'object') {
      return null;
    }
    
    // Check for direct errors
    if (obj._errors?.length) {
      return obj._errors[0];
    }
    
    // Recursively check nested objects
    for (const key in obj) {
      if (key === '_errors') continue;
      const nestedResult = this.extractFirstErrorMessage(obj[key]);
      if (nestedResult) {
        return nestedResult;
      }
    }
    
    return null;
  }
  
  /**
   * Recursively builds an error structure that matches the schema
   * @param formattedErrors The formatted errors from ZodError
   * @param schema The zod schema
   * @returns An object with the same structure as the schema
   */
  private buildErrorStructure(formattedErrors: any, schema: z.ZodType): any {
    // Base case - if there are no errors or schema is primitive
    if (!formattedErrors || typeof formattedErrors !== 'object') {
      return formattedErrors?._errors?.[0] || null;
    }
    
    // Handle root level errors
    if (formattedErrors._errors?.length > 0) {
      // If we're at a primitive schema type, just return the error message
      if (!(schema instanceof z.ZodObject) && !(schema instanceof z.ZodArray)) {
        return formattedErrors._errors[0];
      }
    }
    
    // Handle object schemas
    if (schema instanceof z.ZodObject) {
      const shape = schema.shape;
      const result: Record<string, any> = {};
      
      // If there are errors at this level that apply to the whole object
      if (formattedErrors._errors?.length && Object.keys(formattedErrors).length === 1) {
        // Distribute the error to all properties in the schema
        for (const key in shape) {
          result[key] = formattedErrors._errors[0];
        }
        return result;
      }
      
      // Process each property in the schema shape
      for (const key in shape) {
        if (formattedErrors[key]) {
          // If there are errors for this property, process them recursively
          result[key] = this.buildErrorStructure(formattedErrors[key], shape[key]);
        }
      }
      
      // Handle special case for role_data with numeric indices
      // This is a special case handler for the specific structure in your error
      if ('role_data' in formattedErrors) {
        result.role_data = {};
        
        // Process all numeric keys within role_data
        for (const key in formattedErrors.role_data) {
          if (key !== '_errors' && !isNaN(Number(key))) {
            const nestedErrors = this.processNestedObject(formattedErrors.role_data[key]);
            if (Object.keys(nestedErrors).length > 0) {
              if (!result.role_data) result.role_data = {};
              result.role_data = { ...result.role_data, ...nestedErrors };
            }
          }
        }
      }
      
      // Process any array-like objects (numerically indexed) in the formatted errors
      for (const key in formattedErrors) {
        if (key !== '_errors') {
          const value = formattedErrors[key];
          
          // Check if this is an array-like object with numeric keys
          if (typeof value === 'object' && value !== null) {
            const numericKeys = Object.keys(value).filter(k => !isNaN(Number(k)) && k !== '_errors');
            
            if (numericKeys.length > 0) {
              if (!result[key]) result[key] = {};
              
              // Process each numerically indexed item
              for (const idx of numericKeys) {
                const nestedErrors = this.processNestedObject(value[idx]);
                if (Object.keys(nestedErrors).length > 0) {
                  result[key] = { ...result[key], ...nestedErrors };
                }
              }
            }
          }
        }
      }
      
      // Filter out null values to keep the result clean
      return Object.fromEntries(
        Object.entries(result).filter(([_, value]) => {
          return value !== null && 
                 (typeof value !== 'object' || 
                  Object.keys(value).length > 0);
        })
      );
    }
    
    // Handle array schemas
    if (schema instanceof z.ZodArray) {
      if (Array.isArray(formattedErrors)) {
        return formattedErrors.map((err, idx) => 
          this.buildErrorStructure(err, schema.element)
        );
      }
      
      // Handle non-array objects with numeric keys which represent array indices
      const numericKeys = Object.keys(formattedErrors)
        .filter(key => !isNaN(Number(key)) && key !== '_errors');
      
      if (numericKeys.length > 0) {
        const result: Record<string, any> = {};
        
        for (const key of numericKeys) {
          const errorForIndex = this.buildErrorStructure(formattedErrors[key], schema.element);
          if (errorForIndex !== null) {
            result[key] = errorForIndex;
          }
        }
        
        return Object.keys(result).length > 0 ? result : null;
      }
      
      return formattedErrors._errors?.[0] || null;
    }
    
    // For other types of schemas or unrecognized structures, extract errors
    return this.processNestedObject(formattedErrors);
  }
  
  /**
   * Process a nested object to extract error messages, flattening the structure
   * to match the expected output format.
   */
  private processNestedObject(obj: any): Record<string, any> {
    if (!obj || typeof obj !== 'object') {
      return {};
    }
    
    const result: Record<string, any> = {};
    
    // If this object has direct errors, return them
    if (obj._errors?.length) {
      return { [this.findFieldNameFromObject(obj) || 'error']: obj._errors[0] };
    }
    
    // Otherwise, process all nested properties
    for (const key in obj) {
      if (key === '_errors') continue;
      
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        // For nested objects, extract field name and error
        if (obj[key]._errors?.length) {
          result[key] = obj[key]._errors[0];
        } else {
          // Recursively process deeper nested objects
          const nestedResults = this.processNestedObject(obj[key]);
          Object.assign(result, nestedResults);
        }
      }
    }
    
    return result;
  }
  
  /**
   * Attempts to find a valid field name within a nested error object
   */
  private findFieldNameFromObject(obj: any): string | null {
    if (!obj || typeof obj !== 'object') {
      return null;
    }
    
    // Look for fields with _errors arrays
    for (const key in obj) {
      if (key !== '_errors' && obj[key]?._errors?.length) {
        return key;
      }
    }
    
    return null;
  }
}

/**
 * Checks if a schema is a discriminated union
 * @param schema The schema to check
 * @returns True if the schema is a discriminated union
 */
function isDiscriminatedUnionSchema(schema: z.ZodType): schema is z.ZodDiscriminatedUnion<any, any> {
  return (
    schema instanceof z.ZodDiscriminatedUnion ||
    // Check for the internal property that identifies a discriminated union
    (schema as any)._def?.typeName === 'ZodDiscriminatedUnion'
  );
}

/**
 * Checks if a schema is a transformed schema
 * @param schema The schema to check
 * @returns True if the schema is a transformed schema
 */
function isTransformedSchema(schema: z.ZodType): schema is z.ZodEffects<any, any> {
  return (
    schema instanceof z.ZodEffects || 
    (schema as any)._def?.typeName === 'ZodEffects'
  );
}

/**
 * Attempts to extract the inner schema from a transformed or refined schema
 * @param schema The schema to extract from
 * @returns The inner schema if possible, otherwise the original schema
 */
function extractInnerSchema(schema: z.ZodType): z.ZodType {
  if (isTransformedSchema(schema)) {
    const innerSchema = (schema as any)._def?.schema;
    if (innerSchema) {
      return innerSchema;
    }
  }
  return schema;
}

/**
 * Creates a partial version of a discriminated union schema
 * @param schema The discriminated union schema
 * @returns A partial version of the schema
 */
function createPartialDiscriminatedUnion(schema: z.ZodDiscriminatedUnion<any, any>): z.ZodType {
  const discriminator = (schema as any)._def.discriminator;
  const options = (schema as any)._def.options.map((option: z.ZodType) => {
    if (option instanceof z.ZodObject) {
      // We need to keep the discriminator field required and make the rest optional
      const { [discriminator]: discriminatorField, ...restShape } = option.shape;
      
      return z.object({
        [discriminator]: discriminatorField,
        ...Object.fromEntries(
          Object.entries(restShape).map(([key, value]) => [key, (value as z.ZodType).optional()])
        )
      });
    }
    return option; // Fallback if not an object
  });
  
  return z.discriminatedUnion(discriminator, options);
}

/**
 * Creates a utility function to validate data against a schema and
 * return errors in a format that exactly matches the schema structure.
 */
export function createSchemaValidator<T extends z.ZodType>(schema: T) {
  return {
    /**
     * Validates the input data against the schema and returns formatted errors
     * @param data The data to validate
     * @returns An object with errors matching the schema structure exactly, or null if validation succeeds
     */
    validate: (data: unknown): { success: true, data: z.infer<T> } | { success: false, errors: any } => {
      try {
        const result = schema.parse(data);
        return { success: true, data: result };
      } catch (error) {
        if (error instanceof z.ZodError) {
          const customError = new CustomZodError(error.issues);

          throw createError({
            statusCode: 422,
            message: 'Validation failed',
            data: customError.formatToSchema(schema)
          })
        }
        throw error;
      }
    },

    /**
     * Validates the input data against a partial version of the schema,
     * making all fields optional while respecting complex schema types
     * @param data The data to validate
     * @returns An object with errors matching the schema structure exactly, or null if validation succeeds
     */
    validatePartial: (data: unknown): { success: true, data: Partial<z.infer<T>> } | { success: false, errors: any } => {
      try {
        let partialSchema: z.ZodType;

        // Handle discriminated unions specially
        if (isDiscriminatedUnionSchema(schema)) {
          partialSchema = createPartialDiscriminatedUnion(schema as z.ZodDiscriminatedUnion<any, any>);
        }
        // Handle transformed schemas by extracting the inner schema if possible
        else if (isTransformedSchema(schema)) {
          const innerSchema = extractInnerSchema(schema);
          
          if (innerSchema instanceof z.ZodObject) {
            // Apply partial to the inner schema
            partialSchema = innerSchema.partial().transform((data) => {
              // Apply the original transformation if possible
              const transformFn = (schema as any)._def.effect?.transform;
              return transformFn ? transformFn(data) : data;
            });
          } else {
            // For non-object inner schemas, use the original with safeParse
            partialSchema = schema;
          }
        }
        // Standard case for object schemas
        else if (schema instanceof z.ZodObject) {
          partialSchema = schema.partial();
        }
        // For other schema types, fallback to the original schema
        else {
          partialSchema = schema;
        }

        const result = partialSchema.parse(data);
        return { success: true, data: result };
      } catch (error) {
        if (error instanceof z.ZodError) {
          const customError = new CustomZodError(error.issues);
          
          // Use the original schema for error formatting to maintain structure
          return { 
            success: false, 
            errors: customError.formatToSchema(schema)
          };
        }
        throw error;
      }
    },

    /**
     * Validates a single field and returns only the error message for that field
     * @param data The data to validate 
     * @param fieldId The field identifier/path (can be dot notation for nested fields)
     * @returns The error message as a string or null if validation succeeds
     */
    validateField: (data: unknown, fieldId: string): string | null => {
      try {
        schema.parse(data);
        return null; // No errors
      } catch (error) {
        if (error instanceof z.ZodError) {
          const customError = new CustomZodError(error.issues);
          return customError.getFieldError(fieldId);
        }
        // For non-zod errors, return a generic message
        return 'Validation failed';
      }
    }
  };
}