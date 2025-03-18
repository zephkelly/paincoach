import { DatabaseService } from "~~/server/services/databaseService";

export default defineEventHandler({
    onRequest: [ ],
    handler: async (event) => {
        const transaction = await DatabaseService.getInstance().createTransaction();

        try {
            transaction.query(`
                INSERT INTO private.mailing_list_subscription (email, unsubscribe_token, source)
                SELECT 
                    email, 
                    unsubscribe_token,
                    'migrated_from_users_table' AS source
                FROM 
                    private.users
                WHERE 
                    email IS NOT NULL
                ON CONFLICT (email) DO NOTHING;
            `);

            await transaction.commit();
        }
        catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
});