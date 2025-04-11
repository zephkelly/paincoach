import { DatabaseService } from "~~/server/services/databaseService";
import { setupInvitationTables } from "./invitation";

export async function createDatabaseTables() {
    const db = new DatabaseService();

    await setupInvitationTables(db);
}