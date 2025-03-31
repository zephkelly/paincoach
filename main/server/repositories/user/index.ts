import type { H3Event } from 'h3';

import type { DBTransaction } from '~~/server/types/db';

import type { UserRegister } from '@@/shared/types/v1/user/registration';
import type { DBUserWithRoles } from '@@/shared/types/v1/user';
import type { LimitedUserWithRoles } from '@@/shared/types/v1/user/limited';

import { createUserInDB } from './functions/createUser';
import { getCachedLimitedUserWithRolesByEmail } from '~~/server/repositories/user/functions/getUserByEmail';
import { getCachedDBUserWithRolesByEmail } from './functions/getDBUserByEmail';




export class UserRepository {
    public static async getLimitedUserWithRoles(event: H3Event, option: { email: string }): Promise<LimitedUserWithRoles | undefined> {
        if (option.email) {
            return await getCachedLimitedUserWithRolesByEmail(event, option.email);
        }
        else {
            return undefined;
        }
    }

    public static async getDBUserWithRoles(event: H3Event, option: { email: string }): Promise<DBUserWithRoles | undefined> {
        if (option.email) {
            return await getCachedDBUserWithRolesByEmail(event, option.email);
        }
        else {
            return undefined;
        }
    }

    public static async createUser(
        userRegisterRequest: UserRegister,
        password_hash: string,
    ): Promise<string> {
        return await createUserInDB(userRegisterRequest, password_hash);
    }
}
