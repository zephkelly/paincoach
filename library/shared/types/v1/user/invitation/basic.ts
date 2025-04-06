import { z } from 'zod';

import {
    BasicUserInvitationSchema,
} from '@@/shared/schemas/v1/user/invitation/basic';



export type BasicUserInvitation = z.infer<typeof BasicUserInvitationSchema>;