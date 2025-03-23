import { z } from 'zod';

import { BigIntSchema } from '@@/shared/schemas/primitives';

import { DBPatientUserDataSchema } from './data';



export const DBPatientUserProfileSchema = DBPatientUserDataSchema.extend({
    user_id: BigIntSchema,
    created_at: z.date(),
    updated_at: z.date(),
});