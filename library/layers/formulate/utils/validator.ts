import { z } from 'zod';

import { FormulateError } from './error'



/**
 * Configuration options for schema validator
 */
export interface SchemaValidatorOptions {
    /** Optional custom partial schema (if not provided, will be inferred) */
    partialSchema?: z.ZodType;
	
	/** Include the validate method */
	validate?: boolean;
	
	/** Include the validatePartial method */
	validatePartial?: boolean;
	
	/** Include the validateField method */
	validateField?: boolean;
	
	/** Include the validateArray method */
	validateArray?: boolean;
	
	/** Include the validatePartialArray method */
	validatePartialArray?: boolean;
}

/**
 * Helper function to create an error object
 */
function createError(options: { 
	statusCode: number; 
	message: string; 
	data?: any 
}): Error {
	const error = new Error(options.message);
	(error as any).statusCode = options.statusCode;
	(error as any).data = options.data;
	return error;
}

/**
 * Creates a schema validator with explicitly chosen validation methods
 * @param schema The Zod schema to validate against
 * @param options Configuration options with validators to include
 * @returns A validator object with only the specified validation methods
 */
export function createSchemaValidator<T extends z.ZodType>(
	schema: T,
	options: SchemaValidatorOptions
): Record<string, any> {
	const {
		partialSchema,
		validate = false,
		validatePartial = false,
		validateField = false,
		validateArray = false,
		validatePartialArray = false
	} = options;
	
	// Get the appropriate partial schema
	const getPartialSchema = (): z.ZodType => {
		if (partialSchema) {
			return partialSchema;
		}
		
		if (schema instanceof z.ZodObject) {
			return schema.partial();
		}
		
		return schema;
	};
	
	// Get the array item schema
	const getArrayItemSchema = (): z.ZodType => {
		if (schema instanceof z.ZodArray) {
			return schema.element;
		}
		
		return schema;
	};
	
	// Get the partial array item schema - uses the custom partial schema if provided
	const getPartialArrayItemSchema = (): z.ZodType => {
		if (partialSchema && schema instanceof z.ZodArray) {
			// If the partial schema itself is an array, use its element
			if (partialSchema instanceof z.ZodArray) {
				return partialSchema.element;
			}
			// Otherwise, use the entire partial schema
			return partialSchema;
		}
		
		const itemSchema = getArrayItemSchema();
		
		if (itemSchema instanceof z.ZodObject) {
			return itemSchema.partial();
		}
		
		return itemSchema;
	};
	
	// Error handlers
	const handleValidationError = (
		error: any, 
		schemaToFormat: z.ZodType, 
		statusCode = 422, 
		message = 'Validation failed'
	): never => {
		if (error instanceof z.ZodError) {
			const customError = new FormulateError(error.issues);
			
			throw createError({
				statusCode,
				message,
				data: customError.formatToSchema(schemaToFormat)
			});
		}
		
		throw error;
	};
	
	const handleArrayValidationError = (
		error: any,
		arraySchema: z.ZodType,
		statusCode = 422,
		message = 'Array validation failed'
	): never => {
		if (error instanceof z.ZodError) {
			const customError = new FormulateError(error.issues);
			
			throw createError({
				statusCode,
				message,
				data: customError.formatToSchema(arraySchema)
			});
		}
		
		throw error;
	};
	
	// Build the validator object with only the requested methods
	const validator: Record<string, any> = {};
	
	if (validate) {
		validator.validate = (data: unknown): z.infer<T> => {
			try {
				return schema.parse(data);
			} catch (error) {
				return handleValidationError(error, schema);
			}
		};
	}
	
	if (validatePartial) {
        validator.validatePartial = (data: unknown): Partial<z.infer<T>> => {
            try {
                const partialSchema = getPartialSchema();
                
                const objectData = typeof data === 'object' && data !== null 
                    ? data 
                    : {};
                
                const dataWithDefaults = partialSchema.parse(objectData);

                return dataWithDefaults;
            }
            catch (error) {
                return handleValidationError(
                    error, 
                    getPartialSchema(), 
                    422, 
                    'Partial validation failed'
                );
            }
        };
    }
	
    if (validateField) {
            validator.validateField = (data: unknown, fieldId: string): string | null => {
            try {
                if (schema instanceof z.ZodObject) {
                    // Check if the field exists in the schema
                    if (!(fieldId in schema.shape)) {
                        return `Field '${fieldId}' does not exist in the schema`;
                    }
            
                    // Extract the field schema
                    const fieldSchema = schema.shape[fieldId];
                    
                    // Create a single field schema to properly capture validation context
                    const singleFieldSchema = z.object({
                        [fieldId]: fieldSchema
                    });
                    
                    // Get the field value from data, handling potential undefined data
                    const dataObj = typeof data === 'object' && data !== null ? data : {};
                    const fieldValue = (dataObj as any)[fieldId];
                    
                    // Validate just this field
                    singleFieldSchema.parse({
                        [fieldId]: fieldValue
                    });
                    
                    return null;
                }
                else if (schema instanceof z.ZodArray) {
                    // If schema is an array and fieldId is numeric, validate the array item at that index
                    const index = parseInt(fieldId, 10);
                    if (!isNaN(index) && Array.isArray(data) && index >= 0 && index < data.length) {
                        const itemSchema = schema.element;
                        itemSchema.parse(data[index]);
                        return null;
                    }
                    else {
                        return `Invalid array index: ${fieldId}`;
                    }
                }
                else {
                    // For primitive schemas, validate the entire data
                    schema.parse(data);
                    return null;
                }
            }
            catch (error) {
                if (error instanceof z.ZodError) {
                    const customError = new FormulateError(error.issues);
                    return customError.getFieldError(fieldId) || error.issues[0]?.message || 'Validation failed';
                }
                
                return error instanceof Error ? error.message : 'Validation failed';
            }
        };
    }
	
	if (validateArray) {
		validator.validateArray = (data: unknown[]): Array<z.infer<T> extends Array<infer U> ? U : z.infer<T>> => {
			const itemSchema = getArrayItemSchema();
			const arraySchema = z.array(itemSchema);
			
			try {
				return arraySchema.parse(data);
			} catch (error) {
				return handleArrayValidationError(
					error,
					arraySchema
				);
			}
		};
	}
	
	if (validatePartialArray) {
        validator.validatePartialArray = (data: unknown[]): Array<Partial<z.infer<T> extends Array<infer U> ? U : z.infer<T>>> => {
            const partialItemSchema = partialSchema || getPartialArrayItemSchema();
            const partialArraySchema = z.array(partialItemSchema);
            
            try {
                const arrayData = Array.isArray(data) ? data : [];
                
                const processedData = arrayData.map(item => {
                    const processedItem = partialItemSchema.parse(item || {});
                    return processedItem;
                });
                
                return partialArraySchema.parse(processedData);
            }
            catch (error) {
                return handleArrayValidationError(
                    error,
                    partialArraySchema,
                    422,
                    'Partial array validation failed'
                );
            }
        };
    }
	
	// If no methods were requested, warn in development
	if (Object.keys(validator).length === 0) {
		console.warn(
			'Warning: createSchemaValidator was called without specifying any validation methods. ' +
			'No methods will be available on the returned validator.'
		);
	}
	
	return validator;
}