import type { Role } from "@@/shared/types/v1/role";
import { DatabaseService } from "~~/server/services/databaseService";

import type { DBUserInvitationDataPartial } from "@@/shared/types/v1/user/invitation/data";

import { validateUUID } from "@@/shared/schemas/primitives";
import { updateInvitationStatusTransactional } from "./updateInvitationStatus";
import type { DBTransaction } from "~~/server/types/db";


export type CreateInvitationParams = {
    token: string,
    user_email: string,
    user_phone_number: string | undefined,
    user_primary_role: Role,
    user_roles: Role[],
    user_invitation_data: DBUserInvitationDataPartial | undefined,
    invited_by_user_id: string,
}

export async function createInvitationTransactional(transaction: DBTransaction, invitation: CreateInvitationParams): Promise<{ invitation_id: string }> {
    try {
        const invitationCreationResult = await transaction.query(`
            INSERT INTO invitation.user_invitation (
                invitation_token,
                email,
                phone_number,
                primary_role,
                roles,
                invitation_data,
                invited_by_user_id,
                expires_at,
                public_user_id
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7,
                NOW() + INTERVAL '7 days',
                uuid_generate_v7()
            ) RETURNING id
        `, [
            invitation.token,
            invitation.user_email,
            invitation.user_phone_number,
            invitation.user_primary_role,
            invitation.user_roles,
            invitation.user_invitation_data,
            invitation.invited_by_user_id,
        ]);

        return {
            invitation_id: validateUUID(invitationCreationResult[0].id)
        }
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