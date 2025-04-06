import type { H3Event } from "h3";

import { DatabaseService } from "~~/server/services/databaseService";
import type { DBTransaction } from "~~/server/types/db";

import type { Role } from "@@/shared/types/v1/role";

import type { PaginationParams } from "@@/shared/types/pagination";

import type { InvitationStatus } from "@@/shared/types/v1/user/invitation";
import type { LimitedUserInvitation } from "@@/shared/types/v1/user/invitation/limited";
import { 
    getCachedLimitedInvitationByToken,
    invalidateCachedLimitedInvitation,
} from "./functions/getLimitedInvitation";

import type { DBUserInvitation } from "@@/shared/types/v1/user/invitation";
import type { DBUserInvitationDataPartial } from "@@/shared/types/v1/user/invitation/data";
import {
    getCachedDBInvitationByToken,
    invalidateCachedDBInvitation,
} from "./functions/getDBInvitation";

import {
    getCachedBasicInvitation,
    invalidateCachedBasicInvitation
} from "./functions/getBasicInvitation";

import {
    getBasicInvitations,
} from "./functions/getBasicInvitations";

import {
    getCachedInvitationsCount,
    invalidateCachedInvitationsCount,
} from "./functions/getInvitationsCount";


import { verifyInvitedUser } from "./functions/verifyInvitedUser";
import { verifyInvitedByUser } from "./functions/verifyInvitedByUser";
import { createInvitationTransactional } from "./functions/createInvitation";

import { updateInvitationStatus, updateInvitationStatusTransactional  } from "./functions/updateInvitationStatus";
import { setLinkedInvitationUser } from "./functions/setLinkedInvitationUser";

export class InvitationRepository {
    public static async getInvitationsCount(event: H3Event): Promise<number> {
        return await getCachedInvitationsCount(event);
    }
    
    public static async getDBInvitation(event: H3Event, token: string): Promise<DBUserInvitation | null> {
        return await getCachedDBInvitationByToken(event, token);
    }

    public static async getLimitedInvitation(event: H3Event, token: string): Promise<LimitedUserInvitation | null> {
       return await getCachedLimitedInvitationByToken(event, token);
    }
    public static async getBasicInvitation(event: H3Event, token: string): Promise<LimitedUserInvitation | null> {
        return await getCachedBasicInvitation(event, token);
    }

    public static async getBasicInvitations(event: H3Event,
        paginationParams: PaginationParams = {
            page: 1,
            items: 10,
            offset: undefined,
        }
    ) {
        return await getBasicInvitations(event, paginationParams.page, paginationParams.items, paginationParams.offset);
    }


    public static async updateInvitationStatus(options: { token: string, invitation_id?: string }, status: InvitationStatus, caused_by_user_id?: string, transaction?: DBTransaction): Promise<void> {
        if (transaction) {
            await updateInvitationStatusTransactional(transaction, options, status, caused_by_user_id);
        }
        else {
            await updateInvitationStatus(options, status, caused_by_user_id);
        }

        // Invalidate the cached invitation
        await invalidateCachedBasicInvitation(options.token);
        await invalidateCachedLimitedInvitation(options.token);
        await invalidateCachedDBInvitation(options.token);
    }

    public static async createInvitation(
        transaction: DBTransaction,
        token: string,
        user_email: string,
        user_phone_number: string | undefined,
        user_primary_role: Role,
        user_roles: Role[],
        user_invitation_data: DBUserInvitationDataPartial | undefined,
        invited_by_user_id: string,
    ) {
        return await createInvitationTransactional(transaction, {
            token,
            user_email,
            user_phone_number,
            user_primary_role,
            user_roles,
            user_invitation_data,
            invited_by_user_id,
        });
    }

    public static async completeInvitation(
        transaction: DBTransaction,
        token: string,
        user_id: string,
    ): Promise<void> {
        await this.updateInvitationStatus({ token }, 'completed', user_id, transaction);

        await setLinkedInvitationUser(transaction, user_id, token);

        // Invalidate the cached invitations
        await invalidateCachedBasicInvitation(token);
        await invalidateCachedLimitedInvitation(token);
        await invalidateCachedDBInvitation(token);
    }

    public static async invalidateCache(token?: string): Promise<void> {
        if (token) {
            await invalidateCachedLimitedInvitation(token);
            await invalidateCachedDBInvitation(token);
            await invalidateCachedBasicInvitation(token);
        }
        
        await invalidateCachedInvitationsCount();
    }

    // Verify identify of users accessing the invitation
    public static async verifyInvitedByClinician(clinician_id: string, invitation_token: string): Promise<boolean> {
        return await verifyInvitedByUser(clinician_id, invitation_token);
    }

    public static async verifyInvitedUser(invited_user_public_id: string, invitation_token: string): Promise<boolean> {
        return await verifyInvitedUser(invited_user_public_id, invitation_token);
    }
}