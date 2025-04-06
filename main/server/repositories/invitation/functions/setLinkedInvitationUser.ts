import type { DBTransaction } from "~~/server/types/db";



export async function setLinkedInvitationUser(
    transaction: DBTransaction,
    user_id: string,
    invitation_token: string
): Promise<void> {
    await transaction.query(
        `UPDATE invitation.user_invitation SET linked_user_id = $1 WHERE invitation_token = $2`,
        [user_id, invitation_token]
    );
}