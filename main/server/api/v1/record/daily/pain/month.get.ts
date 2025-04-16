import { H3Error } from 'h3';
import { onRequestValidateSession } from '~~/server/utils/auth/request-middleware/validate-session';
import { onRequestValidatePermission } from '~~/server/utils/auth/request-middleware/validate-permission';

import { PERMISSIONS } from '@@/shared/schemas/v1/permission';

import { PainDailyRecordService } from '~~/server/services/record/daily/painDailyRecordService';



export default defineEventHandler({
    onRequest: [
        (event) => onRequestValidateSession(event),
        (event) => onRequestValidateRole(event, 'app'),
        (event) => onRequestValidatePermission(event, [
            PERMISSIONS.APP.USE.PAIN
        ]),
    ],
    handler: async (event) => {
        try {
            const {
                registeredSession
            } = await getPainCoachSession(event);

            const lastMonthDailyRecords = await PainDailyRecordService.getLastMonthPainDailyRecords(event, registeredSession);

            return lastMonthDailyRecords
        }
        catch (error: unknown) {
            if (error instanceof H3Error) {
                throw error;
            }
            
            if (error instanceof Error) {
                throw createError({
                    statusCode: 500,
                    message: error.message,
                });
            }

            console.error('Error getting records:', error);
            throw createError({
                statusCode: 500,
                message: 'Internal Server Error',
            });
        }
    }
})