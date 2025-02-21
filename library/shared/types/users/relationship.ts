import { z } from 'zod';
import { ClinicianPatientRelationshipSchema } from '../../schemas/users/relationship';



export type ClinicianPatientRelationship = z.infer<typeof ClinicianPatientRelationshipSchema>;