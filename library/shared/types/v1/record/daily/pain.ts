import * as z from 'zod';
import { DBPainDailyRecord } from '@@/shared/schemas/v1/record/daily/pain';
import { PainDailyRecordNoIdSchema } from '@@/shared/schemas/v1/record/daily/pain/noid';



export type DBPainDailyRecord = z.infer<typeof DBPainDailyRecord>;
export type PainDailyRecordNoId = z.infer<typeof PainDailyRecordNoIdSchema>;