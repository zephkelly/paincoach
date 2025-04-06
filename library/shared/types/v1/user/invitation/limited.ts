import { z } from 'zod';

import {
    LimitedUserInvitationSchema,
} from '@@/shared/schemas/v1/user/invitation/limited';



export type LimitedUserInvitation = z.infer<typeof LimitedUserInvitationSchema>;