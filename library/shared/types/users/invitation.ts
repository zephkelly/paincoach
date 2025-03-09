import { z } from 'zod';
import { UserInvitationSchema, RegistrationTypeSchema, InvitationStatusSchema } from '@@/shared/schemas/users/invitation';



export type RegistrationType = z.infer<typeof RegistrationTypeSchema>;
export type InvitationStatus = z.infer<typeof InvitationStatusSchema>;

export type UserInvitation = z.infer<typeof UserInvitationSchema>