import { DatabaseService } from "../databaseService";
import type { DBTransaction } from "~~/server/types/db";

import type { MinimalUserWithRoles } from "@@/shared/types/v1/user/minimal";
import { validateMinimalUsersWithRoles } from "@@/shared/schemas/v1/user/minimal";

import { getMinimalUserWithRoles } from "../../utils/user/database/get/byEmail";


export class UserService {
    public static async getMinimalUserWithRolesTransaction(transaction: DBTransaction, email: string): Promise<MinimalUserWithRoles | undefined> { 
        return await getMinimalUserWithRoles(transaction, email)
    };
}