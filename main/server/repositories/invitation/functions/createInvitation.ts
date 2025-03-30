import type { Role } from "@@/shared/types/v1/role";
import { DatabaseService } from "~~/server/services/databaseService";

import type { DBUserInvitationDataPartial } from "@@/shared/types/v1/user/invitation/data";


export type CreateInvitationParams = {
    token: string,
    user_email: string,
    user_phone_number: string | undefined,
    user_primary_role: Role,
    user_roles: Role[],
    user_invitation_data: DBUserInvitationDataPartial | undefined,
    invited_by_user_id: string,
}

export async function createInvitationInDB(invitation: CreateInvitationParams): Promise<void> {
    const db = DatabaseService.getInstance();

    try {
        await db.query(`
            INSERT INTO private.user_invitation (
                invitation_token,
                email,
                phone_number,
                primary_role,
                roles,
                invitation_data,
                invited_by_user_id,
                status,
                expires_at,
                public_user_id
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7,
                'pending',
                NOW() + INTERVAL '7 days',
                uuid_generate_v7()
            )
        `, [
            invitation.token,
            invitation.user_email,
            invitation.user_phone_number,
            invitation.user_primary_role,
            invitation.user_roles,
            invitation.user_invitation_data,
            invitation.invited_by_user_id,
        ]);
    }
    catch (error: unknown) {
        if (
            typeof error === 'object' && 
            error !== null && 
            'code' in error && 
            'constraint' in error && 
            error.code === '23505' && 
            error.constraint === 'user_invitation_email_key'
        ) {
            throw createError({
                statusCode: 409, // Conflict
                statusMessage: 'An invitation has already been sent to this email address'
            });
        }
        
        // Re-throw any other errors
        throw error;
    }
}