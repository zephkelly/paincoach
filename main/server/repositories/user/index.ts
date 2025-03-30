import type { H3Event } from 'h3';

import type { DBUserWithRoles } from '@@/shared/types/v1/user';
import type { LimitedUserWithRoles } from '@@/shared/types/v1/user/limited';

import { getCachedLimitedUserWithRolesByEmail } from '~~/server/repositories/user/functions/getUserByEmail';
import { getCachedDBUserWithRolesByEmail } from './functions/db/getDBUserByEmail';



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
}
