import { z } from 'zod';

import {
    MinimalUserInvitationSchema,
} from '@@/shared/schemas/v1/user/invitation/minimal';



export type MinimalUserInvitation = z.infer<typeof MinimalUserInvitationSchema>;