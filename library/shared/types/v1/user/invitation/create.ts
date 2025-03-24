import { z } from 'zod';

import {
    CreateUserInvitationRequestSchema,
    CreateUserInvitationRequestPartialSchema,
} from '@@/shared/schemas/v1/user/invitation/create';



export type CreateUserInvitationRequest = z.infer<typeof CreateUserInvitationRequestSchema>;
export type CreateUserInvitationRequestPartial = z.infer<typeof CreateUserInvitationRequestPartialSchema>;