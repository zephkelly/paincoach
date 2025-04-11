import { z } from 'zod';

import { UUIDSchema } from '@@/shared/schemas/primitives';

import { DBClinicianUserDataSchema } from './data';



export const DBClinicianUserProfileSchema = DBClinicianUserDataSchema.extend({
    user_id: UUIDSchema,
    created_at: z.date(),
    updated_at: z.date(),
});