import { H3Event } from "h3";
import type { UserSession } from "#auth-utils";

import { PainDailyRecordRepository } from "~~/server/repositories/record/daily/pain";


export class PainDailyRecordService {  
    public static async getLastMonthPainDailyRecords(event: H3Event, session: UserSession) {
        const user_id = session.secure?.id;

        if (!user_id) {
            throw createError({
                statusCode: 400,
                statusMessage: 'User ID not found in session',
            });
        }

        return await PainDailyRecordRepository.getLastMonthRecords(event, user_id);
    }
}
