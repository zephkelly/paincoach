import { z } from 'zod';

import { BaseUserSchema } from '../users/base';



export const RecordPrivacyLevelSchema = z.enum(['standard', 'sensitive', 'restricted']);

export const HealthDataSchema = z.object({

});

export const MetadataSchema = z.object({
    title: z.string().max(255),
    category: z.string().max(100),
    tags: z.array(z.string()).optional(),
    created_by: z.string().uuid(),
    last_modified_by: z.string().uuid()
});

export const MedicalRecordSchema = z.object({
    id: z.string().uuid(),
    patient_id: z.string().uuid(),
    clinician_id: z.string().uuid(),
    record_type: z.string().max(100),
    metadata: MetadataSchema,
    health_data: HealthDataSchema,
    privacy_level: RecordPrivacyLevelSchema.default('standard'),
    created_at: z.date().default(() => new Date()),
    updated_at: z.date().default(() => new Date())
});


export function safeValidateMedicalRecord(data: any) {
    const parsedResult = MedicalRecordSchema.safeParse(data);
    if (!parsedResult.success) {
        throw new Error(parsedResult.error.errors[0].message);
    }
    return parsedResult.data;
}

// Helper function to check data sharing rules
export function validateDataSharingRules(data: z.infer<typeof BaseUserSchema>) {
    if (data.last_data_sharing_revocation_date && !data.last_data_sharing_consent_date) {
        throw new Error('Consent date is required for revocation');
    }
    
    if (data.last_data_sharing_revocation_date && data.last_data_sharing_consent_date) {
        if (data.last_data_sharing_revocation_date <= data.last_data_sharing_consent_date) {
            throw new Error('Revocation date must be after consent date');
        }
    }
    
    if (data.last_data_sharing_revocation_date && data.data_sharing_enabled) {
        throw new Error('Data sharing cannot be enabled if there is a revocation date');
    }
    
    return true;
}