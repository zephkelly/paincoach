import { z } from 'zod';

import {
    DBBaseInvitationUserDataSchema,
    DBBaseInvitationUserDataPartialSchema,

    DBUserInvitationDataSchema,
    DBUserInvitationDataPartialSchema
} from '@@/shared/schemas/v1/user/invitation/data';



export type DBBaseInvitationUserData = z.infer<typeof DBBaseInvitationUserDataSchema>;
export type DBBaseInvitationUserDataPartial = z.infer<typeof DBBaseInvitationUserDataPartialSchema>;

export type DBUserInvitationData = z.infer<typeof DBUserInvitationDataSchema>;
export type DBUserInvitationDataPartial = z.infer<typeof DBUserInvitationDataPartialSchema>;