import { z } from 'zod';

import {
    DBUserInvitationSchema,
    DBUserInvitationPartialSchema,
} from '@@/shared/schemas/v1/user/invitation';



export type DBUserInvitation = z.infer<typeof DBUserInvitationSchema>;
export type DBUserInvitationPartial = z.infer<typeof DBUserInvitationPartialSchema>;