import { z } from 'zod';

import { createSchemaValidator } from '@@/layers/ember/utils/validator';
import { UUIDSchema } from '@@/shared/schemas/primitives';

import { InvitationStatusSchema } from '../index';



export const DBUserInvitationHistorySchema = z.object({
    id: UUIDSchema,
    user_invitation_id: UUIDSchema,
    caused_by_user_id: UUIDSchema.nullable(),
    status: InvitationStatusSchema,
    created_at: z.coerce.date(),
});

export const DBUserInvitationHistoryValidator = createSchemaValidator(DBUserInvitationHistorySchema);