import type { InvitationStatus } from "@@/shared/types/v1/user/invitation";
import type { DBTransaction } from "~~/server/types/db";

import { validateUUID } from "@@/shared/schemas/primitives";
import { DatabaseService } from "~~/server/services/databaseService";



/**
 * Updates an invitation's status by adding a new record to the history table
 * Finds the invitation ID using the token within the transaction
 */
export async function updateInvitationStatusTransactional(
    transaction: DBTransaction,
    options: {
        token: string,
        invitation_id?: string,
    },
    status: InvitationStatus,
    causedByUserId?: string
): Promise<void> {
    if (!options.token) {
        throw createError({
            statusCode: 400,
            message: 'A token must be provided to update this invitation'
        });
    }

    let invitationId: string | undefined = options.invitation_id;

    if (!invitationId) {
        const invitationResult = await transaction.query(`
            SELECT id FROM invitation.user_invitation
            WHERE invitation_token = $1
        `, [options.token]);
        
        if (invitationResult.length === 0) {
            throw createError({
                statusCode: 404,
                message: 'Invitation not found'
            });
        }
        
        invitationId = validateUUID(invitationResult[0].id);
    }

    await transaction.query(`
        INSERT INTO invitation.user_invitation_history (
            user_invitation_id,
            caused_by_user_id,
            status
        ) VALUES (
            $1, $2, $3
        )
    `, [
        invitationId,
        causedByUserId,
        status
    ]);
}

/**
 * Updates an invitation's status by adding a new record to the history table
 * Finds the invitation ID using the token within the transaction
 */
export async function updateInvitationStatus(
    options: {
        token: string,
        invitation_id?: string,
    },
    status: InvitationStatus,
    causedByUserId?: string
): Promise<void> {
    if (!options.token) {
        throw createError({
            statusCode: 400,
            message: 'A token must be provided to update this invitation'
        });
    }

    let invitationId: string | undefined = options.invitation_id;

    const db = DatabaseService.getInstance();

    if (!invitationId) {
        const invitationResult = await db.query(`
            SELECT id FROM invitation.user_invitation
            WHERE invitation_token = $1
        `, [options.token]);
        
        if (invitationResult.length === 0) {
            throw createError({
                statusCode: 404,
                message: 'Invitation not found'
            });
        }
        
        invitationId = validateUUID(invitationResult[0].id);
    }

    await db.query(`
        INSERT INTO invitation.user_invitation_history (
            user_invitation_id,
            caused_by_user_id,
            status
        ) VALUES (
            $1, $2, $3
        )
    `, [
        invitationId,
        causedByUserId,
        status
    ]);
}