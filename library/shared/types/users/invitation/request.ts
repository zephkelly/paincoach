import { z } from 'zod';
import { InviteUserRequestSchema, UserInviteSchema, UserInvitePartialSchema } from '@@/shared/schemas/user/invitation/request';



export type InviteUserRequest = z.infer<typeof InviteUserRequestSchema>;

export type UserInvite = z.infer<typeof UserInviteSchema>;
export type UserInvitePartial = z.infer<typeof UserInvitePartialSchema>;