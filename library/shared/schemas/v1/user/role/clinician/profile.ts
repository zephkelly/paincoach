import { z } from 'zod';

import { BigIntSchema } from '@@/shared/schemas/primitives';

import { DBClinicianUserDataSchema } from './data';



export const DBClinicianUserProfileSchema = DBClinicianUserDataSchema.extend({
    user_id: BigIntSchema,
    created_at: z.date(),
    updated_at: z.date(),
});