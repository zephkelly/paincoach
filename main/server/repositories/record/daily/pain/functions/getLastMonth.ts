import { H3Event } from 'h3';
import { DatabaseService } from '~~/server/services/databaseService';

import type { PainDailyRecordNoId } from '@@/shared/types/v1/record/daily/pain';
import { PainDailyRecordNoIdValidator } from '@@/shared/schemas/v1/record/daily/pain/noid';



const FUNCTION_NAME = 'get-30-days-pain-daily-records';

export const getCachedLastMonthPainDailyRecords = defineCachedFunction(async (event: H3Event, user_id: string): Promise<PainDailyRecordNoId[]> => {
    const db = DatabaseService.getInstance();

    try {
        if (!user_id) {
            throw createError({
                statusCode: 400,
                statusMessage: 'User Id is required'
            });
        }

        // Get basic user data
        const recordsResult = await db.query<PainDailyRecordNoId[]>(`
            SELECT * FROM record.last_30_days_daily_record_pain 
            WHERE user_id = $1
        `, [user_id]);
       
        if (recordsResult.length === 0) {
            return [];
        }
       
        // Filter out null values from roles array (in case user has no roles)
        return PainDailyRecordNoIdValidator.validateArray(recordsResult);
    }
    catch (error: unknown) {
        console.error('Error fetching user with roles from database:', error);

        throw error
    }
}, {
    maxAge: 3600,
    name: FUNCTION_NAME,
    getKey: (event: H3Event, user_email: string) => `${FUNCTION_NAME}-${user_email}`,
    integrity: process.env.LIMITED_USER_ROLES_VERSION || '6',
});

export async function invalidateCachedLastMonthPainDailyRecords(user_email: string) {
    await invalidateNitroFunctionCache(FUNCTION_NAME, `${FUNCTION_NAME}-${user_email}`);
}