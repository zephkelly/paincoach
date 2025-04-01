import type { AllRoles } from '@@/shared/types/v1/role';


/**
 * Middleware to validate if the user has one of the allowed roles
 * @param event - The H3Event
 * @param allowedRoles - Single role or array of roles that are allowed to access the route
 * @param requireAll - If true, user must have ALL of the allowedRoles; if false, ANY role is sufficient
 */
export async function onRouteValidateRoles(
    allowedRoles: AllRoles[] | AllRoles,
    requireAll: boolean = false
) {
    const { session, userRoles } = useAuth();

    const sessionRoles = userRoles.value
    
    if (!sessionRoles || !sessionRoles.length) {
        console.error('Session is not valid or user has no roles:', session.value);
        return false;
    }
    
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    
    const hasRequiredRoles = requireAll
        ? roles.every(role => sessionRoles.includes(role))
        : roles.some(role => sessionRoles.includes(role));
    
    if (!hasRequiredRoles) {
        console.error('User does not have the required roles:', session.value);
        return false;
    }
}