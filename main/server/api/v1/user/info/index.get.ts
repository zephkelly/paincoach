import { H3Error, defineEventHandler } from 'h3';

import type { PaginationParams } from '@@/shared/types/api';

import { onRequestValidateSession } from '~~/server/utils/auth/request-middleware/validate-session';
import { onRequestValidateRole } from '~~/server/utils/auth/request-middleware/validate-role';

import { getPainCoachSession } from '~~/server/utils/auth/session/getSession';

import { DatabaseService } from '~~/server/services/databaseService';
import { getAllUsers } from '~~/server/utils/user/database/get/all';
import { getUsersClinicianPatients } from '~~/server/utils/user/patients/database/get/clinicianPatients';

import { type Role } from '@@/shared/types/v1/role';
import { hasRole } from '~~/server/utils/user/role';

import type { UserWithRoles } from '@@/shared/types/v1/user';
import type { OwnerUserWithRoles } from '@@/shared/types/v1/user/role/owner';
import type { AdminUserWithRoles } from '@@/shared/types/v1/user/role/admin';
import type { ClinicianUserWithRoles } from '@@/shared/types/v1/user/role/clinician';
import type { PatientUserWithRoles } from '@@/shared/types/v1/user/role/patient';
import type {
    AllUsersGetResponse,
    PatientsUserGetResponse
} from '@@/shared/types/v1/user/info/get';

import { validateUsersWithRoles } from '@@/shared/schemas/v1/user';





export default defineEventHandler({
    onRequest: [
        (event) => onRequestValidateSession(event),
        (event) => onRequestValidateRole(event, ['owner', 'admin', 'clinician'])
    ],
    handler: async (event) => {
        const {
            secureSession
        } = await getPainCoachSession(event);

        const userRole = secureSession.primary_role;

        if (userRole === 'patient') {
            throw createError({
                statusCode: 403,
                statusMessage: 'Forbidden',
                message: 'You do not have permission to access this resource'
            })
        }

        const query = getQuery(event);

        const paginationParams: PaginationParams = {
            page: parseInt(query.page as string) || 0,
            limit: parseInt(query.limit as string) || 10,
            roles: query.roles ? (query.roles as string).split(',') : null
        }

        const db = await DatabaseService.getInstance().createTransaction();

        try {
            if (hasRole(secureSession, ['owner', 'admin'])) {
                const allfetchedUsers = await getAllUsers(db, paginationParams);
                const validatedUsers = validateUsersWithRoles(allfetchedUsers);

                const userMap = new Map<Exclude<Role, 'incomplete_user'>, UserWithRoles[]>()

                // Initialize empty arrays for each role type
                userMap.set('owner', [])
                userMap.set('admin', [])
                userMap.set('clinician', [])
                userMap.set('patient', [])

                // Sort users into the appropriate role category with type casting
                validatedUsers.forEach(user => {
                    const role = user.primary_role as Role

                    if (role === 'owner' || role === 'admin' || role === 'clinician' || role === 'patient') {
                        if (role === 'owner') {
                            userMap.get('owner')?.push(user as OwnerUserWithRoles)
                        }
                        else if (role === 'admin') {
                            userMap.get('admin')?.push(user as AdminUserWithRoles)
                        }
                        else if (role === 'clinician') {
                            userMap.get('clinician')?.push(user as ClinicianUserWithRoles)
                        }
                        else if (role === 'patient') {
                            userMap.get('patient')?.push(user as PatientUserWithRoles)
                        }
                    }
                })

                const adminUsersResponse: AllUsersGetResponse = {
                    users: {
                        owner: userMap.get('owner') as OwnerUserWithRoles[] || [],
                        admin: userMap.get('admin') as AdminUserWithRoles[] || [],
                        clinician: userMap.get('clinician') as ClinicianUserWithRoles[] || [],
                        patient: userMap.get('patient') as PatientUserWithRoles[] || []
                    }
                }

                return adminUsersResponse
            }
            else {
                const id = secureSession.user_id;
                const patientUsers = await getUsersClinicianPatients(db, paginationParams, id);
                const validatedPatientUsers = validateUsersWithRoles(patientUsers) as PatientUserWithRoles[];

                const patientUsersResponse: PatientsUserGetResponse = {
                    users: {
                        patient: validatedPatientUsers
                    }
                }
                return patientUsersResponse
            }
        }
        catch (error: unknown) {
            if (error instanceof H3Error) {
                console.log(error)
                throw error
            }

            console.error('GET /api/v1/user error:', error)
            throw createError({
                statusCode: 500,
                statusMessage: 'Internal Server Error',
                message: 'An unexpected error occurred'
            })
        }
    }
});

