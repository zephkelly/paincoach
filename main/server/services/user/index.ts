import { type H3Event, H3Error } from 'h3';

import type { DBTransaction } from '~~/server/types/db';
import { DatabaseService } from '../databaseService';

import { UserRepository } from '~~/server/repositories/user';
import { ClinicianUserRepository } from '~~/server/repositories/user/role/clinician';
import { PatientUserRepository } from '~~/server/repositories/user/role/patient';
import { RoleRepository } from '~~/server/repositories/role';
import { InvitationRepository } from '~~/server/repositories/invitation';
import { PermissionRepository } from '~~/server/repositories/permission';

import { invalidateCachedLimitedInvitation } from '~~/server/repositories/invitation/functions/getLimitedInvitation';
import { invalidateCachedDBInvitation } from '~~/server/repositories/invitation/functions/getDBInvitation';

import type { UnregisteredUserSession } from '#auth-utils';
import type { UserRegister } from '@@/shared/types/v1/user/registration';

import { PERMISSIONS } from '@@/shared/schemas/v1/permission';
import { validateUUID } from '@@/shared/schemas/primitives';



export class UserService {
    
    public static async registerInviteUser(
        event: H3Event,
        userRegisterRequest: UserRegister,
        session: UnregisteredUserSession,
    ) {
        const token = session.secure.invitation_token

        // Fetch invitation and verify registration data
        const invitation = await InvitationRepository.getDBInvitation(event, token);
        if (!invitation) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Invitation not found',
            });
        }

        // Check if the invitation is expired
        if (invitation.expires_at && new Date(invitation.expires_at) < new Date()) {
            throw createError({
                statusCode: 410,
                statusMessage: 'Invitation expired',
            });
        }

        // Ensure the invitation email matches the user email
        if (userRegisterRequest.email !== invitation.email) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Invitation email does not match',
            });
        }

        // Ensure that the roles on the registration request and the invitation match
        const invitationRoles = new Set(invitation.roles);
        const requestedRoles = new Set(userRegisterRequest.roles);

        if (userRegisterRequest.will_use_app) {
            invitationRoles.add('app');
            requestedRoles.add('app');
        }
        else {
            invitationRoles.delete('app');
            requestedRoles.delete('app');
        }

        for (const role of requestedRoles) {
            if (!invitationRoles.has(role)) {
                throw createError({
                    statusCode: 400, 
                    statusMessage: `Requested role "${role}" was not included in the original invitation`
                });
            }
        }


        // Verify the inviting user has the required permissions to grant the roles
        const invitingUserPermissions = await PermissionRepository.getPermissions(event, invitation.invited_by_user_id);
        const roleToPermissionMap = {
            'admin': PERMISSIONS.INVITATION.INVITE.ADMIN,
            'clinician': PERMISSIONS.INVITATION.INVITE.CLINICIAN,
            'patient': PERMISSIONS.INVITATION.INVITE.PATIENT,
            'owner': PERMISSIONS.INVITATION.INVITE.OWNER,
            'app': PERMISSIONS.INVITATION.INVITE.APP,
        };

        const requiredPermissions = userRegisterRequest.roles.map(role => {
            const permission = roleToPermissionMap[role];
            if (!permission) {
                throw createError({
                    statusCode: 400,
                    statusMessage: `Invalid role: ${role}`
                });
            }
            return permission;
        });

        if (!hasPermission(invitingUserPermissions, requiredPermissions, true)) {
            throw createError({
                statusCode: 403,
                message: 'Please reach out to an administrator, the inviting user no longer has the required permissions to grant you these roles.',
            });
        }


        // Create main user profile
        const hashedPassword = await hashPassword(userRegisterRequest.password);

        let user_id: string | undefined;

        try {
            user_id = await UserRepository.createUser(
                userRegisterRequest,
                hashedPassword,
            );
        }
        catch (error: unknown) {
            if (error instanceof H3Error) {
                throw error;
            }

            console.log('Error creating user:', error);
            throw createError({
                statusCode: 500,
                message: 'Internal Server Error',
            });
        }
        

        const validatedUUID = validateUUID(user_id);

        const transaction = await DatabaseService.getInstance().createTransaction();
        try {
            await this.insertRoleProfileData(
                transaction,
                validatedUUID,
                userRegisterRequest.role_data
            );
            
            await RoleRepository.assignRolesToUser(
                transaction,
                validatedUUID,
                userRegisterRequest.roles,
                userRegisterRequest.primary_role
            );
    
            await InvitationRepository.completeInvitation(
                transaction,
                token,
                validatedUUID
            );

            transaction.commit();
        }
        catch (error: unknown) {
            console.error('Error during transaction:', error);
            await transaction.rollback();
            throw createError({
                statusCode: 500,
                message: 'Internal Server Error',
            });
        }

        // Invalidate the cached invitation
        await invalidateCachedLimitedInvitation(token);
        await invalidateCachedDBInvitation(token);
        
        console.log('User created successfully:', user_id);
    }

    private static async insertRoleProfileData(transaction: DBTransaction, userId: string, roleData: any[]) {
        if (!roleData || !Array.isArray(roleData)) {
            return;
        }
    
        for (const data of roleData) {
            const { role, ...profileData } = data;
            
            if (role === 'clinician') {
                await ClinicianUserRepository.createClinicianProfile(
                    transaction,
                    userId,
                    profileData
                );
            }
            else if (role === 'patient') {
                await PatientUserRepository.createPatientProfile(
                    transaction,
                    userId,
                    profileData
                );
            }
        }
    }
}