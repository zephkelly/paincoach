

import type { LimitedUserInvitation } from "@@/shared/types/v1/user/invitation/minimal";

import { getLimitedInvitationByToken } from "./functions/getInvitation";
import { verifyInvitedUser } from "./functions/verifyInvitedUser";
import { verifyInvitedByUser } from "./functions/verifyInvitedByUser";



export class InvitationRepository {
    public static async getLimitedInvitation(token: string): Promise<LimitedUserInvitation> {
       return await getLimitedInvitationByToken(token);
    }

    // Verify identify of users accessing the invitation
    public static async verifyInvitedByClinician(clinician_id: string, invitation_token: string): Promise<boolean> {
        return await verifyInvitedByUser(clinician_id, invitation_token);
    }

    public static async verifyInvitedUser(invited_user_public_id: string, invitation_token: string): Promise<boolean> {
        return await verifyInvitedUser(invited_user_public_id, invitation_token);
    }
}