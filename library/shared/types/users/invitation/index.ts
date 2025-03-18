import { z } from 'zod';
import { DBUserInvitationSchema, UserInvitationSchema, RegistrationTypeSchema, InvitationStatusSchema } from '@@/shared/schemas/user/invitation';



export type RegistrationType = z.infer<typeof RegistrationTypeSchema>;
export type InvitationStatus = z.infer<typeof InvitationStatusSchema>;

export type DBUserInvitation = z.infer<typeof DBUserInvitationSchema>
export type UserInvitation = z.infer<typeof UserInvitationSchema>