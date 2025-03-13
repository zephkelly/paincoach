import { H3Error } from 'h3';
import type { PaginationParams } from '@@/shared/types/api';
import { onRequestValidateSession } from '~~/server/utils/auth/request-middleware/verify-session';
import { getPainCoachSession } from '~~/server/utils/auth/session/getSession';

import { DatabaseService } from '~~/server/services/databaseService';
import type { DBTransaction } from '~~/server/types/db';
import type { User, PatientUser, ClinicianUser, AdminUser } from '~~lib/shared/types/users';
import { type UserRole } from '~~lib/shared/types/users';
import { validateUsers } from '~~lib/shared/schemas/users';
import { validatePatientUsers } from '~~lib/shared/schemas/users/patient';

import { getAllUsers } from '~~/server/utils/user/database/get/all';
import { getUsersClinicianPatients } from '~~/server/utils/user/patients/database/get/clinicianPatients';



export interface AdminUserGetResponse {
    users: {
        admin: AdminUser[];
        clinician: ClinicianUser[];
        patient: PatientUser[];
    };
}

export interface ClinicianUserGetResponse {
    users: {
        patient: PatientUser[];
    };
}

export default defineEventHandler({
    onRequest: [
        (event) => onRequestValidateSession(event),
    ],
    handler: async (event) => {
        const {
            secureSession
        } = await getPainCoachSession(event);

        const userRole = secureSession.user_role;

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
            if (userRole === 'admin') {
                const allfetchedUsers = await getAllUsers(db, paginationParams);
                const validatedUsers = validateUsers(allfetchedUsers);

                const userMap = new Map<UserRole, User[]>()

                // Initialize empty arrays for each role type
                userMap.set('admin', [])
                userMap.set('clinician', [])
                userMap.set('patient', [])

                // Sort users into the appropriate role category with type casting
                validatedUsers.forEach(user => {
                    const role = user.role as UserRole

                    if (role === 'admin' || role === 'clinician' || role === 'patient') {
                        // Type assertion based on role
                        if (role === 'admin') {
                            userMap.get('admin')?.push(user as AdminUser)
                        } else if (role === 'clinician') {
                            userMap.get('clinician')?.push(user as ClinicianUser)
                        } else if (role === 'patient') {
                            userMap.get('patient')?.push(user as PatientUser)
                        }
                    }
                })

                const adminUsersResponse: AdminUserGetResponse = {
                    users: {
                        admin: userMap.get('admin') as AdminUser[] || [],
                        clinician: userMap.get('clinician') as ClinicianUser[] || [],
                        patient: userMap.get('patient') as PatientUser[] || []
                    }
                }

                return adminUsersResponse
            }
            else {
                const id = secureSession.user_id;
                const patientUsers = await getUsersClinicianPatients(db, paginationParams, id);
                const validatedPatientUsers = validatePatientUsers(patientUsers);

                const patientUsersResponse: ClinicianUserGetResponse = {
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

