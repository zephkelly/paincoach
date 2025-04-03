import { DatabaseService } from "~~/server/services/databaseService";



export async function verifyInvitedUser(invited_user_public_id: string, invitation_token: string): Promise<boolean> {
    const db = DatabaseService.getInstance();

    const result = await db.query<{ exists: boolean }>(`
        SELECT EXISTS (
            SELECT 1 FROM invitation.user_invitation WHERE invitation_token = $1 AND public_user_id = $2
        )
    `, [invitation_token, invited_user_public_id]);

    if (!result[0] || !result[0].exists) {
        return false;
    }

    return true;
}