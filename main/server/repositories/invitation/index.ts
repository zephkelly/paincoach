import type { H3Event } from "h3";
import type { Role } from "@@/shared/types/v1/role";

import type { DBUserInvitationDataPartial } from "@@/shared/types/v1/user/invitation/data";
import type { LimitedUserInvitation } from "@@/shared/types/v1/user/invitation/minimal";

import { getCachedLimitedInvitationByToken } from "./functions/getInvitation";
import { verifyInvitedUser } from "./functions/verifyInvitedUser";
import { verifyInvitedByUser } from "./functions/verifyInvitedByUser";


import { createInvitationInDB, type CreateInvitationParams } from "./functions/createInvitation";



export class InvitationRepository {
    public static async getLimitedInvitation(event: H3Event, token: string): Promise<LimitedUserInvitation> {
       return await getCachedLimitedInvitationByToken(event, token);
    }

    // Verify identify of users accessing the invitation
    public static async verifyInvitedByClinician(clinician_id: string, invitation_token: string): Promise<boolean> {
        return await verifyInvitedByUser(clinician_id, invitation_token);
    }

    public static async verifyInvitedUser(invited_user_public_id: string, invitation_token: string): Promise<boolean> {
        return await verifyInvitedUser(invited_user_public_id, invitation_token);
    }

    public static async createInvitation(
        token: string,
        user_email: string,
        user_phone_number: string | undefined,
        user_primary_role: Role,
        user_roles: Role[],
        user_invitation_data: DBUserInvitationDataPartial | undefined,
        invited_by_user_id: string,
    ): Promise<void> {
        await createInvitationInDB({
            token,
            user_email,
            user_phone_number,
            user_primary_role,
            user_roles,
            user_invitation_data,
            invited_by_user_id,
        });
    }
}