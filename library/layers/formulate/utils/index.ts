import { createSchemaValidator } from "./validator";



export class Formulate {
    /**
     * Creates a schema validator with validation methods
     * @param schema The Zod schema to validate against
     * @param options Configuration options with optional custom partial schema
     * @returns A validator object with validation methods
     */
    static createSchemaValidator = createSchemaValidator;
    
    // Prevent instantiation
    private constructor() {
      throw new Error("Formulate is a static class and cannot be instantiated");
    }
  }