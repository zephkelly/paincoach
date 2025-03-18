import { z } from 'zod';
import { ClinicianPatientRelationshipSchema } from '../../schemas/user/relationship';



export type ClinicianPatientRelationship = z.infer<typeof ClinicianPatientRelationshipSchema>;