import { z } from 'zod';

import {
    LimitedUserInvitationSchema,
} from '@@/shared/schemas/v1/user/invitation/limited';



export type MinimalUserInvitation = z.infer<typeof LimitedUserInvitationSchema>;