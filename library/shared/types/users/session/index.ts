import { z } from 'zod';

import {
    SessionUserObjectSchema,
    SessionSecureDataObjectSchema,
    SessionUserSessionObjectSchema,

} from '@@/shared/schemas/users/session';



export type SessionUserObjectSchema = z.infer<typeof SessionUserObjectSchema>;
export type SessionSecureDataObjectSchema = z.infer<typeof SessionSecureDataObjectSchema>;
export type SessionUserSessionObjectSchema = z.infer<typeof SessionUserSessionObjectSchema>;