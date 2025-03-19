import { H3Error } from 'h3';

import { type SecureSessionData, type User } from "#auth-utils";
import { type DBTransaction } from "~~/server/types/db";
import { type InviteUserRequest } from "@@/shared/types/users/invitation/create";

import { EmailService } from '~~/server/services/emailService';



export async function createAdminInvitation(transaction: DBTransaction, adminData: InviteUserRequest, secureSession: SecureSessionData, userData: User) {
    let adminId: string | undefined = undefined;

    if (adminData.mock) {
        if (secureSession.user_role !== 'admin') {
            throw createError({
                statusCode: 403,
                message: 'Only administrators can invite other administrators',
            });
        }

        if (adminData.mock.role) {
            if (adminData.mock.role !== 'admin') {
                throw createError({
                    statusCode: 403,
                    message: 'Only administrators can invite other administrators',
                });
            }
        }

        if (adminData.mock.id) {
            const adminResult = await transaction.query<{ exists: boolean }>(`
                SELECT EXISTS (
                    SELECT 1 FROM private.user WHERE id = $1 AND role_id = (SELECT id FROM private.role WHERE name = 'admin')
                )
            `, [adminData.mock.id]);

            if (!adminResult[0] || !adminResult[0].exists) {
                throw createError({
                    statusCode: 400,
                    message: 'Invalid admin ID, only admins can invite other admins',
                });
            }

            adminId = adminData.mock.id;
        }
    }
    else {
        if (secureSession.user_role !== 'admin') {
            throw createError({
                statusCode: 403,
                statusMessage: 'Only administrators can invite other administrators',
            });
        }

        adminId = secureSession.user_id;
    }

    const registrationType = 'full';
    const invitationToken = crypto.randomUUID();

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    try {
        const roleResult = await transaction.query(`
            SELECT id FROM private.role WHERE name = 'admin' LIMIT 1
        `);

        if (!roleResult.length) {
            throw new Error('Admin role not found');
        }

        const adminRoleId = roleResult[0].id;

        // Create invitation
        const invitationResult = await transaction.query(`
            INSERT INTO private.user_invitation (
                email,
                phone_number,
                user_id,
                invitation_token, 
                invited_by, 
                role_id,
                registration_type,
                expires_at,
                registration_data,
                status
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending'
            ) RETURNING id
        `, [
            adminData.user.email,
            adminData.user.phone_number || null,
            crypto.randomUUID(),
            invitationToken,
            adminId, // Current admin's ID as the inviter
            adminRoleId,
            registrationType,
            expiresAt,
            adminData.user,
        ]);

        const invitationId = invitationResult[0].id;

        await transaction.commit();

        try {
            // Send email
            await EmailService.getInstance().sendAdminInvitationEmail(
                adminData.user.email,
                invitationToken,
                userData.first_name,
                userData.profile_url,
            );
        }
        catch (error: unknown) {
            console.error('Error sending admin invitation email:', error);
        }

        // Return success result
        return {
            success: true,
            invitationId,
            registrationType,
            invitationToken,
            expiresAt
        };

    }
    catch (error: unknown) {
        if (error instanceof H3Error) {
            throw error;
        }

        console.error('Error creating admin invitation:', error);

        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to create admin invitation',
        });
    }
}