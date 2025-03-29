import { z } from 'zod';

import { UUIDSchema } from '@@/shared/schemas/primitives';

import { DBPatientUserDataSchema } from './data';



export const DBPatientUserProfileSchema = DBPatientUserDataSchema.extend({
    user_id: UUIDSchema,
    created_at: z.date(),
    updated_at: z.date(),
});