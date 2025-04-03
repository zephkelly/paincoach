import type { H3Event } from 'h3';

import type { DBTransaction } from '~~/server/types/db';

import type { UserLoginVerificationData } from '@@/shared/types/v1/user/login/ verify';
import type { UserRegister } from '@@/shared/types/v1/user/registration';
import type { DBUserWithRoles } from '@@/shared/types/v1/user';
import type { LimitedUserWithRoles } from '@@/shared/types/v1/user/limited';

import { createUserInDB } from './functions/createUser';

import {
    getCachedDBUserWithRolesByEmail,
    invalidateCachedDBUserWithRolesByEmail
} from './functions/getDBUserByEmail';

import {
    getCachedLimitedUserWithRolesByEmail,
    invalidateCachedLimitedUserWithRolesByEmail
} from '~~/server/repositories/user/functions/getUserByEmail';


import { getUserLoginVerificationData } from './functions/loginVerifyUser';



export class UserRepository {
    public static async getUserLoginData(option: { email: string }): Promise<UserLoginVerificationData | undefined> {
        if (option.email) {
            return await getUserLoginVerificationData(option.email);
        }
        else {
            return undefined;
        }
    }

    /**
     * Returns the entire DB user object with roles
     * @param event - H3 event
     * @param option - Options containing the email of the user
     * @returns Promise<DBUserWithRoles | undefined> - The DB user object with roles or undefined if not found
     *
    */
    public static async getDBUserWithRoles(event: H3Event, option: { email: string }): Promise<DBUserWithRoles | undefined> {
        if (option.email) {
            return await getCachedDBUserWithRolesByEmail(event, option.email);
        }
        else {
            return undefined;
        }
    }

    public static async getLimitedUserWithRoles(event: H3Event, option: { email: string }): Promise<LimitedUserWithRoles | undefined> {
        if (option.email) {
            return await getCachedLimitedUserWithRolesByEmail(event, option.email);
        }
        else {
            return undefined;
        }
    }

    public static async createUser(
        transaction: DBTransaction,
        user_id: string,
        userRegisterRequest: UserRegister,
        password_hash: string,
    ): Promise<void> {
        return await createUserInDB(transaction, user_id, userRegisterRequest, password_hash);
    }


    public static async purgeCache(options: {
        email: string
    }): Promise<void> {
        if (options.email) {
            await invalidateCachedLimitedUserWithRolesByEmail(options.email);
            await invalidateCachedDBUserWithRolesByEmail(options.email);
        }
    }
}
