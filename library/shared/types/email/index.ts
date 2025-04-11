import { z } from 'zod';

import { DBEmailFeedbackSchema, DBEmailFeedbackTypeSchema } from '@@/shared/schemas/email';


export type DBEmailFeedbackType = z.infer<typeof DBEmailFeedbackTypeSchema>;
export type DBEmailFeedback = z.infer<typeof DBEmailFeedbackSchema>;