import * as z from "zod";
import { UUIDSchema } from "../../primitives";

import { RecordTypeSchema } from "./type";
import { DBDailyRecordDataV1Schema } from "./data/pain/index";


export const DBPainDailyRecord = z.interface({
    id: UUIDSchema,
    date: z.date(),
    created_at: z.date(),
    updated_at: z.date(),
    user_id: UUIDSchema,
    record_type: z.literal("pain"),
    record_data: DBDailyRecordDataV1Schema
})