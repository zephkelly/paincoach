import { H3Event } from 'h3'
import type { UserSession, SecureSessionData, User } from '#auth-utils';
import { type UserRole } from '@@/shared/types/users';



export async function getPainCoachSession(event: H3Event) {
    const session = await getUserSession(event) as UserSession;
    const secureSession = session.secure as SecureSessionData;
    const userSession = session.user as User;

    const user_id: string = secureSession.user_id;

    const role: UserRole = secureSession.user_role;
    const isSuperAdminRole = role === 'super_admin';
    const isAdminRole = role === 'admin';
    const isAdmin = isSuperAdminRole || isAdminRole;
    const isClinicianRole = role === 'clinician';
    const isPatientRole = role === 'patient';
    const isIncompleteUserRole = role === 'incomplete_user';

    function isRole(role: UserRole) {
        return secureSession.user_role === role;
    }

    return {
        session,
        secureSession,
        userSession,
        
        user_id,

        role,
        isRole,

        /**
         * Bool check for Admins and Super Admins
         * @type {boolean}
         * @readonly
         * @memberof getPainCoachSession
         */
        isAdmin,
        isSuperAdminRole,
        isAdminRole,
        isClinicianRole,
        isPatientRole,
        isIncompleteUserRole,
    }
}