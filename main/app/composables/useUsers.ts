import type { AdminUser, ClinicianUser, PatientUser } from '@@/shared/types/users';
import { type AdminUserGetResponse } from '~~/server/api/v1/user/info/index.get';

export const useUsers = async () => {
    const state = useState<{
        adminUsers: AdminUser[];
        clinicianUsers: ClinicianUser[];
        patientUsers: PatientUser[];
    }>('useUsersState', () => (({
        adminUsers: [],
        clinicianUsers: [],
        patientUsers: [],
    })))

    const {
        userRole,
        isMockingUserData,
        isMockingRole,
        mockUserAPIData
    } = useAuth();

    const adminUsers = computed(() => state.value.adminUsers)
    const clinicianUsers = computed(() => state.value.clinicianUsers)
    const patientUsers = computed(() => state.value.patientUsers)

    async function fetch() {
        if (!import.meta.client) return;

        try {
            let fetchedUsers = undefined;

            if (isMockingUserData || isMockingRole) {
                fetchedUsers = await $fetch<AdminUserGetResponse>('/api/v1/user/info?roles=all&page=0&limit=10', {
                    method: 'POST',
                    body: mockUserAPIData.value
                });
            }
            else {
                fetchedUsers = await $fetch<AdminUserGetResponse>('/api/v1/user/info?roles=all&page=0&limit=10');
            }

            state.value.adminUsers = fetchedUsers.users.admin;
            state.value.clinicianUsers = fetchedUsers.users.clinician
            state.value.patientUsers = fetchedUsers.users.patient
            console.log(state.value)
        }
        catch (error: any) {
            console.log('Could not fetch users', error);
        }
    }

    watch(() => userRole.value, (oldRole, newRole) => {
        console.log('Mock user role changed, fetching users');
        fetch();
    });

    return {
        state,
        fetch,

        adminUsers,
        clinicianUsers,
        patientUsers,
    }
};