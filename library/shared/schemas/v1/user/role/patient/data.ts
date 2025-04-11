import { z } from 'zod';



export const DBPatientUserDataSchema = z.object({});

export const DBPatientUserDataPartialSchema = DBPatientUserDataSchema.partial();