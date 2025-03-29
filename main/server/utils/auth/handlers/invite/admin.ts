import { H3Event, H3Error } from 'h3';

import { getPainCoachSession } from '~~/server/utils/auth/session/getSession';

import { type DBTransaction } from "~~/server/types/db";
import type { CreateUserInvitationRequest } from '@@/shared/types/v1/user/invitation/create';

import { EmailService } from '~~/server/services/emailService';



export async function createAdminInvitation(
    event: H3Event,
    transaction: DBTransaction,
    adminData: CreateUserInvitationRequest,
) {
    const {
        userSession,
        secureSession,
        hasRole
    } = await getPainCoachSession(event);

    let invitingUserId: string | undefined = undefined;
    
    if (!hasRole('admin')) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Only administrators can invite other administrators',
        });
    }

    invitingUserId = secureSession.id as string;

    const invitationToken = crypto.randomUUID();

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    try {
        // Create invitation
        const invitationResult = await transaction.query(`
            INSERT INTO private.user_invitation (
                email,
                phone_number,
                invitation_token, 
                invited_by_user_id, 
                primary_role,
                roles,
                expires_at,
                invitation_data,
                status,
                public_user_id,
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending', uuid_generate_v7()
            ) RETURNING id
        `, [
            adminData.email,
            adminData.phone_number || null,
            invitationToken,
            invitingUserId,
            adminData.primary_role,
            adminData.roles,
            expiresAt,
            adminData.invitation_data,
        ]);

        const invitationId = invitationResult[0].id;

        await transaction.commit();

        try {
            // Send email
            await EmailService.getInstance().sendAdminInvitationEmail(
                adminData.email,
                invitationToken,
                userSession.first_name,
                userSession.profile_url,
            );
        }
        catch (error: unknown) {
            console.error('Error sending admin invitation email:', error);
        }

        // Return success result
        return {
            success: true,
            invitationId,
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