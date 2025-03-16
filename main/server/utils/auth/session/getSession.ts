import { H3Event } from 'h3'
import type { UserSession, SecureSessionData, User } from '#auth-utils';
import { type UserRole } from '@@/shared/types/users';
import { isValidRole } from '../../user/role';



export async function getPainCoachSession(event: H3Event) {
    const session = await getUserSession(event) as UserSession;
    const secureSession = session.secure as SecureSessionData;
    const userSession = session.user as User;

    const user_id: string = secureSession.user_id;

    const role: UserRole = secureSession.user_role;
    const isAdmin = role === 'admin';
    const isClinician = role === 'clinician';
    const isPatient = role === 'patient';
    const isIncompleteUser = role === 'incomplete_user';

    function isRole(roles: UserRole | UserRole[]) {
        return isValidRole(roles, secureSession);
    }

    return {
        session,
        secureSession,
        userSession,
        
        user_id,

        role,
        /**
         * Bool check for roles
         * @type {boolean}
         * @readonly
         * @memberof getPainCoachSession
         */
        isRole,

        /**
         * Bool check for admins and 
         * @type {boolean}
         * @readonly
         * @memberof getPainCoachSession
         */
        isAdmin,
        isClinician,
        isPatient,
        isIncompleteUser,
    }
}