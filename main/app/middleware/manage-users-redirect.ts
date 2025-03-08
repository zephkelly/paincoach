import { validateUserRole } from '~~lib/shared/schemas/users/base';



export default defineNuxtRouteMiddleware(async (to, from) => {
    const queryParams = to.query;

    if (queryParams.type) {
        const tabIndexParam = (queryParams.tab) ? `?tab=${queryParams.tab}` : '';

        try {
            const validatedUserRole = validateUserRole(queryParams.type as string);

            const session = useUserSession().session.value;

            if (!session || !session.user) {
                return navigateTo('/dashboard/login');
            }

            if (validatedUserRole === 'admin' && session.user.user_role !== 'admin') {
                return navigateTo('/dashboard/manage/user' + tabIndexParam);
            }
            else if (validatedUserRole === 'clinician' && (session.user.user_role !== 'admin' && session.user.user_role !== 'clinician')) {
                return navigateTo('/dashboard/manage/user' + tabIndexParam);
            }
            else if (validatedUserRole === 'patient' && (session.user.user_role !== 'admin' && session.user.user_role !== 'clinician')) {
                console.log(session.user.user_role)
                return navigateTo('/dashboard/manage/user' + tabIndexParam);
            }

            return navigateTo(`/dashboard/manage/user/${validatedUserRole}${tabIndexParam}`);
        }
        catch (error) {
            return navigateTo('/dashboard/manage/user');
        }
    }
});