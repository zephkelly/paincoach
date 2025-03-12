import { z } from 'zod';
import { InviteUserRequestSchema } from '@@/shared/schemas/users/invitation/request';



export type InviteUserRequest = z.infer<typeof InviteUserRequestSchema>;