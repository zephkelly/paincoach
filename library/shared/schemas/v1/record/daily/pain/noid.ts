import * as z from 'zod';
import { DBPainDailyRecord } from '@@/shared/schemas/v1/record/daily/pain';
import { createSchemaValidator } from '@@/layers/ember/utils/validator';



export const PainDailyRecordNoIdSchema = DBPainDailyRecord.omit({
    id: true
})

export const PainDailyRecordNoIdValidator = createSchemaValidator(PainDailyRecordNoIdSchema);