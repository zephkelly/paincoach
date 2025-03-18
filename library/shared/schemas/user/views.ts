// View Schemas
import { z } from 'zod';
import { RelationshipStatusSchema } from './relationship';
import { PHONE_PATTERN } from '../../constants/phone';



export const ClinicianPatientsViewSchema = z.object({
    clinician_id: z.string().uuid(),
    patient_id: z.string().uuid(),
    patient_email: z.string().email(),
    date_of_birth: z.date().refine(
        (date) => date <= new Date(),
        'Date cannot be in the future'
    ),
    emergency_contact_name: z.string().max(255).nullable(),
    emergency_contact_phone: z.string().regex(PHONE_PATTERN).max(50).nullable(),
    relationship_start_date: z.date(),
    relationship_status: RelationshipStatusSchema
});