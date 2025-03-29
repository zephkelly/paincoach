// import type { AdminUser, ClinicianUser, PatientUser } from '~~lib/shared/types/users';
import type { OwnerUser } from '@@/shared/types/v1/user/role/owner';
import type { AdminUser } from '@@/shared/types/v1/user/role/admin';
import type { ClinicianUser } from '@@/shared/types/v1/user/role/clinician';
import type { PatientUser } from '@@/shared/types/v1/user/role/patient';
import type { AllUsersGetResponse, PatientsUserGetResponse } from '@@/shared/types/v1/user/info/get';



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
        userRoles,
        isMockingUser,
        mockUserAPIData
    } = useAuth();

    const adminUsers = computed(() => state.value.adminUsers)
    const clinicianUsers = computed(() => state.value.clinicianUsers)
    const patientUsers = computed(() => state.value.patientUsers)

    async function fetch() {
        if (!import.meta.client) return;

        try {
            let fetchedUsers = undefined;

            if (isMockingUser.value) {
                fetchedUsers = await $fetch<AllUsersGetResponse>('/api/v1/user/info?roles=all&page=0&limit=10', {
                    method: 'POST',
                    body: mockUserAPIData.value
                });

                state.value.adminUsers = fetchedUsers.users.admin;
                state.value.clinicianUsers = fetchedUsers.users.clinician
                state.value.patientUsers = fetchedUsers.users.patient
            }
            else if (userRoles.value?.includes('admin')) {
                fetchedUsers = await $fetch<AllUsersGetResponse>('/api/v1/user/info?roles=all&page=0&limit=10');

                state.value.adminUsers = fetchedUsers.users.admin;
                state.value.clinicianUsers = fetchedUsers.users.clinician
                state.value.patientUsers = fetchedUsers.users.patient
            }
            else {
                fetchedUsers = await $fetch<PatientsUserGetResponse>('/api/v1/user/info?roles=all&page=0&limit=10');
            
                state.value.patientUsers = fetchedUsers.users.patient;
            }
        }
        catch (error: any) {
            console.log('Could not fetch users', error);
        }
    }

    watch(() => userRoles.value, (oldRole, newRole) => {

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