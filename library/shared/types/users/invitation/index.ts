import { z } from 'zod';
import {
    DBUserInvitationSchema,

    UserInvitationSchema,
    UserInvitationSchemaPartial,

    MinimalInvitationSchema,
    MinimalUserInvitationSchemaPartial,

    RegistrationTypeSchema,
    InvitationStatusSchema
} from '@@/shared/schemas/user/invitation';



export type RegistrationType = z.infer<typeof RegistrationTypeSchema>;
export type InvitationStatus = z.infer<typeof InvitationStatusSchema>;

export type DBUserInvitation = z.infer<typeof DBUserInvitationSchema>

export type UserInvitation = z.infer<typeof UserInvitationSchema>
export type UserInvitationPartial = z.infer<typeof UserInvitationSchemaPartial>

export type MinimalUserInvitation = z.infer<typeof MinimalInvitationSchema>
export type MinimalUserInvitationPartial = z.infer<typeof MinimalUserInvitationSchemaPartial>