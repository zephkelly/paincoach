import { z } from 'zod';
import {
    AdminInviteSchema,
    InviteUserRequestSchema,
    UserInviteDataSchema,
    UserInviteDataPartialSchema
} from '@@/shared/schemas/user/invitation/create';


export type AdminInvite = z.infer<typeof AdminInviteSchema>;

export type InviteUserRequest = z.infer<typeof InviteUserRequestSchema>;

export type UserInviteData = z.infer<typeof UserInviteDataSchema>;
export type UserInviteDataPartial = z.infer<typeof UserInviteDataPartialSchema>;