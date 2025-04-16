import { H3Event } from 'h3'
import type {
    UserSession,
    UnregisteredUserSession,
    
    SecureSessionData,
    UnregisteredSecureSessionData,

    User,
    UnregisteredUser,
} from '#auth-utils';
import { type AllRoles } from '@@/shared/types/v1/role';
import { hasPermission } from '../../permission/hasPermission';
import { hasRole } from '~~/server/utils/user/role';
import { getPermissionsContext } from '../../permission/getPermissionsContext';


/**
 * Only ever use this function if you know the session is valid
 * @param event - H3 event object
 * @returns {Promise<{ session: UserSession | UnregisterdUserSession | undefined }>} - Returns the session object
 * @throws {Error} - Throws an error if the session is not valid
 **/
export async function getPainCoachSession(event: H3Event) {
    const { session } = await getUserSessionContext(event) as { session: UserSession | UnregisteredUserSession };
    const secureSession = session?.secure as SecureSessionData | UnregisteredSecureSessionData;
    const userSession = session?.user as User | UnregisteredUser;
    
    const user_id: string | undefined = secureSession.id || undefined;
    
    const roles: AllRoles[] = secureSession.roles;
    const primaryRole: AllRoles = secureSession.primary_role;

    const permissions = await getPermissionsContext(event, user_id as string);

    return {
        session,
        registeredSession: session as UserSession,
        unregisteredSession: session as UnregisteredUserSession,
        secureSession,
        userSession,
        
        user_id,
        
        // Legacy single role support
        role: primaryRole,
        
        // Multi-role support
        roles,
        primaryRole,
        
        /**
         * Check if the user has a specific role or roles
         * @param role - Role or array of roles to check
         * @returns {boolean}
         */
        hasRole: (role: AllRoles | AllRoles[]) => hasRole(secureSession as SecureSessionData, role),

        permissions,

        /**
         * Check if the user has a specific permission or permissions
         * @param requiredPermissions - Permission or array of permissions to check
         * @param requireAll - If true, user must have all permissions. If false, user only needs one of the permissions.
         * @returns {boolean}
         */
        hasPermission,
    }
}



export async function getUserSessionContext(event: H3Event): Promise<{
    session: UserSession | UnregisteredUserSession | undefined
    context: boolean
}> {
    let session: UserSession | UnregisteredUserSession | undefined;
    let hasContext = false;

    if (!event.context.paincoach || !event.context.paincoach.user) {
        event.context.paincoach = {
            user: {
                session: undefined,
                permissions: [],
            },
        };
    }

    if (!event.context.paincoach?.user?.session || !event.context.paincoach?.user?.session.secure || !event.context.paincoach?.user?.session.user) {
        session = await getUserSession(event) as UserSession | UnregisteredUserSession;
        event.context.userSession = session;
    }
    else {
        session = event.context.paincoach.user.session;
        hasContext = true;
    }

    if (!session) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized'
        });
    }

    return {
        session,
        context: hasContext
    };
}