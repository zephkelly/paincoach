import { clientRegisteredSEssionObjectValidator, clientUnregisteredSessionObjectValidator } from '@@/shared/schemas/v1/session';



export function onRouteValidateSession(allowUnregistered: boolean = false): boolean {
    const { session } = useAuth();
    
    if (!session.value || !session.value.user) {
        console.log('Session is not valid or user is not authenticated:', session.value);
        return false;
    }

    try {
        if (allowUnregistered) {
            if (session.value.user.verified) {
                clientRegisteredSEssionObjectValidator.validate(session.value);
            }
            else {
                clientUnregisteredSessionObjectValidator.validate(session.value);
            }
        }
        else {
            clientRegisteredSEssionObjectValidator.validate(session.value);
        }

        return true;
    }
    catch (error: unknown) {
        console.log('Session validation failed:', error);
        navigateTo('/dashboard/login');
        return false;
    }
}