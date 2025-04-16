import { H3Event } from "h3";
import type { PainDailyRecordNoId } from "@@/shared/types/v1/record/daily/pain";

import {
    getCachedLastMonthPainDailyRecords,
    invalidateCachedLastMonthPainDailyRecords,
} from "~~/server/repositories/record/daily/pain/functions/getLastMonth";

export class PainDailyRecordRepository {
    public static async getLastMonthRecords(
        event: H3Event,
        user_id: string,
    ): Promise<PainDailyRecordNoId[]> {
        return await getCachedLastMonthPainDailyRecords(event, user_id);
    }


    public static async purgeCache(options: {
        user_id: string
    }): Promise<void> {
        if (options.user_id) {
            await invalidateCachedLastMonthPainDailyRecords(options.user_id);
        }
    }
}
