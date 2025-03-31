import type { DBTransaction } from '~~/server/types/db';

import { assignRolesToUser } from './function/assignRoles';



export class RoleRepository {
    public static async assignRolesToUser(
        transaction: DBTransaction,
        user_id: string,
        roles: string[],
        primary_role: string,
    ): Promise<void> {
        await assignRolesToUser(transaction, user_id, roles, primary_role);
    }
}
