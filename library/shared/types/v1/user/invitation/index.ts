import { z } from 'zod';

import {
    InvitationRoleSchema,
    InvitationStatusSchema,

    DBUserInvitationSchema,
    DBUserInvitationPartialSchema
} from '@@/shared/schemas/v1/user/invitation';



export type InvitationRole = z.infer<typeof InvitationRoleSchema>;
export type InvitationStatus = z.infer<typeof InvitationStatusSchema>;

export type DBUserInvitation = z.infer<typeof DBUserInvitationSchema>;
export type DBUserInvitationPartial = z.infer<typeof DBUserInvitationPartialSchema>