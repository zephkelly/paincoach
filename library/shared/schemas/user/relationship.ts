import { z } from 'zod';

import { type ClinicianPatientRelationship } from '../../types/users/relationship';



export const RelationshipStatusSchema = z.enum(['active', 'inactive', 'pending', 'terminated']);

export const ClinicianPatientRelationshipSchema = z.object({
    id: z.string().uuid(),
    clinician_id: z.string().uuid(),
    patient_id: z.string().uuid(),
    status: RelationshipStatusSchema.default('pending'),
    start_date: z.date().default(() => new Date()),
    end_date: z.date().nullable(),
    created_at: z.date().default(() => new Date()),
    updated_at: z.date().default(() => new Date())
}).refine(
    (data) => {
        if (data.end_date) {
            return data.end_date > data.start_date;
        }
        return true;
    },
    {
        message: 'End date must be after start date'
    }
);

export function safeValidateRelationship(data: ClinicianPatientRelationship) {
    const parsedResult = ClinicianPatientRelationshipSchema.safeParse(data);
    if (!parsedResult.success) {
        throw new Error(parsedResult.error.errors[0]?.message);
    }
    return parsedResult.data;
}