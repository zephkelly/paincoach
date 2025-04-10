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
				return partialSchema.parse(data);
			} catch (error) {
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
				schema.parse(data);
				return null;
			} catch (error) {
				if (error instanceof z.ZodError) {
					const customError = new FormulateError(error.issues);
					return customError.getFieldError(fieldId);
				}
				return 'Validation failed';
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
			const partialItemSchema = getPartialArrayItemSchema();
			const partialArraySchema = z.array(partialItemSchema);
			
			try {
				return partialArraySchema.parse(data);
			} catch (error) {
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