import { z } from 'zod';



/**
 * Simplified ZodError with focused error formatting capabilities
 */
export class FormulateError extends z.ZodError {
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
        
        // First attempt: Direct path lookup
        let current: Record<string, any> = formatted;
        for (const part of parts) {
            if (!current[part]) {
                // Path segment not found, try to find matching error at root level
                if (parts.length === 1 && this.issues.some(issue => 
                    issue.path.length > 0 && issue.path[issue.path.length - 1] === path)) {
                    // Find the relevant issue
                    const relevantIssue = this.issues.find(issue => 
                        issue.path.length > 0 && issue.path[issue.path.length - 1] === path);
                    return relevantIssue?.message || null;
                }
                return null;
            }
            current = current[part];
        }
        
        // Check for direct errors in the found object
        if (current._errors?.length) {
            return current._errors[0];
        }
        
        // Look for errors in child properties (for nested objects)
        for (const key in current) {
            if (key !== '_errors' && current[key]?._errors?.length) {
                return current[key]._errors[0];
            }
        }
        
        // For transformed or refined fields, the error might be at a different location
        // Check all issues for matching path
        for (const issue of this.issues) {
            const issuePath = issue.path.join('.');
            if (issuePath === path || issue.path.includes(path)) {
                return issue.message;
            }
            
            // Handle array indices in path
            if (parts.length > 0 && !isNaN(Number(parts[parts.length - 1]))) {
                const arrayPath = parts.slice(0, -1).join('.');
                const index = parts[parts.length - 1];

                if (issuePath.startsWith(`${arrayPath}.${index}`)) {
                    return issue.message;
                }
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