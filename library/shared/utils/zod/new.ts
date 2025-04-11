import { z } from 'zod';

/**
 * Simplified ZodError with focused error formatting capabilities
 */
class ZodErrorWrapper extends z.ZodError {
	formatToSchema(schema: z.ZodType): any {
		const formatted = this.format() as Record<string, any>;
		
		if (schema instanceof z.ZodObject) {
			const result: Record<string, any> = {};
			const shape = schema.shape as Record<string, z.ZodType>;
			
			for (const key in shape) {
				if (formatted[key]?._errors?.length) {
					result[key] = formatted[key]._errors[0];
				} else if (formatted[key] && typeof formatted[key] === 'object') {
					const nestedResult = this.extractErrorMessages(formatted[key]);
					if (nestedResult) {
						result[key] = nestedResult;
					}
				}
			}
			
			return Object.keys(result).length > 0 ? result : null;
		}
		
		if (schema instanceof z.ZodArray) {
			return this.formatArrayErrors(formatted);
		}
		
		return formatted._errors?.[0] || null;
	}
	
	private extractErrorMessages(obj: Record<string, any>): any {
		if (!obj || typeof obj !== 'object') {
			return null;
		}
		
		if (obj._errors?.length) {
			return obj._errors[0];
		}
		
		const result: Record<string, any> = {};
		for (const key in obj) {
			if (key === '_errors') continue;
			
			if (obj[key]?._errors?.length) {
				result[key] = obj[key]._errors[0];
			} else if (typeof obj[key] === 'object' && obj[key] !== null) {
				const nestedResult = this.extractErrorMessages(obj[key]);
				if (nestedResult) {
					if (typeof nestedResult === 'object') {
						Object.assign(result, nestedResult);
					} else {
						result[key] = nestedResult;
					}
				}
			}
		}
		
		return Object.keys(result).length > 0 ? result : null;
	}
	
	getFieldError(path: string): string | null {
		const parts = path.split('.');
		const formatted = this.format() as Record<string, any>;
		
		let current: Record<string, any> = formatted;
		for (const part of parts) {
			if (!current[part]) {
				return null;
			}
			current = current[part];
		}
		
		if (current._errors?.length) {
			return current._errors[0];
		}
		
		for (const key in current) {
			if (key !== '_errors' && current[key]?._errors?.length) {
				return current[key]._errors[0];
			}
		}
		
		return null;
	}
	
	private formatArrayErrors(formatted: Record<string, any>): any {
		const result: Record<string, any> = {};
		
		const numericKeys = Object.keys(formatted)
			.filter(key => !isNaN(Number(key)) && key !== '_errors');
			
		if (numericKeys.length > 0) {
			for (const key of numericKeys) {
				const indexErrors = this.extractErrorMessages(formatted[key]);
				if (indexErrors) {
					result[key] = indexErrors;
				}
			}
			return Object.keys(result).length > 0 ? result : null;
		}
		
		return formatted._errors?.[0] || null;
	}
}

/**
 * Configuration options for schema validator
 */
export interface SchemaValidatorOptions {
	/** Optional custom partial schema (if not provided, will be inferred) */
	partialSchema?: z.ZodType;
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
 * Creates a schema validator with validation methods
 * @param schema The Zod schema to validate against
 * @param options Configuration options with optional custom partial schema
 * @returns A validator object with validation methods
 */
export function createSchemaValidator<T extends z.ZodType>(
	schema: T,
	options?: SchemaValidatorOptions
): {
	validate: (data: unknown) => z.infer<T>;
	validatePartial: (data: unknown) => Partial<z.infer<T>>;
	validateField: (data: unknown, fieldId: string) => string | null;
	validateArray: (data: unknown[]) => Array<z.infer<T> extends Array<infer U> ? U : z.infer<T>>;
	validatePartialArray: (data: unknown[]) => Array<Partial<z.infer<T> extends Array<infer U> ? U : z.infer<T>>>;
} {
	// Get the appropriate partial schema
	const getPartialSchema = (): z.ZodType => {
		if (options?.partialSchema) {
			return options.partialSchema;
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
		if (options?.partialSchema && schema instanceof z.ZodArray) {
			// If the partial schema itself is an array, use its element
			if (options.partialSchema instanceof z.ZodArray) {
				return options.partialSchema.element;
			}
			// Otherwise, use the entire partial schema
			return options.partialSchema;
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
			const customError = new ZodErrorWrapper(error.issues);
			
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
			const customError = new ZodErrorWrapper(error.issues);
			
			throw createError({
				statusCode,
				message,
				data: customError.formatToSchema(arraySchema)
			});
		}
		
		throw error;
	};
	
	// The streamlined validator object with core methods
	return {
		validate: (data: unknown): z.infer<T> => {
			try {
				return schema.parse(data);
			} catch (error) {
				return handleValidationError(error, schema);
			}
		},
		
		validatePartial: (data: unknown): Partial<z.infer<T>> => {
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
		},
		
		validateField: (data: unknown, fieldId: string): string | null => {
			try {
				schema.parse(data);
				return null;
			} catch (error) {
				if (error instanceof z.ZodError) {
					const customError = new ZodErrorWrapper(error.issues);
					return customError.getFieldError(fieldId);
				}
				return 'Validation failed';
			}
		},
		
		validateArray: (data: unknown[]): Array<z.infer<T> extends Array<infer U> ? U : z.infer<T>> => {
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
		},
		
		validatePartialArray: (data: unknown[]): Array<Partial<z.infer<T> extends Array<infer U> ? U : z.infer<T>>> => {
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
		}
	};
}