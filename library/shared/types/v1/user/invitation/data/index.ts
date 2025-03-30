import { z } from 'zod';

import { DBUserInvitationDataSchema, DBUserInvitationDataPartialSchema } from '@@/shared/schemas/v1/user/invitation/data';



export type DBUserInvitationData = z.infer<typeof DBUserInvitationDataSchema>;
export type DBUserInvitationDataPartial = z.infer<typeof DBUserInvitationDataPartialSchema>;