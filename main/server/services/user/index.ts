import type { H3Event } from 'h3';

import { UserRepository } from '~~/server/repositories/user';
import type { UnregisteredUserSession } from '#auth-utils';
import type { UserRegister } from '@@/shared/types/v1/user/registration';
import type { Permission } from '@@/shared/types/v1/permission';

export class UserService {
    
    public static async registerInviteUser(
        userRegisterRequest: UserRegister,
        session: UnregisteredUserSession,
        permissions: Permission[],
    ) {
        const token = session.secure.invitation_token
    }
    
}