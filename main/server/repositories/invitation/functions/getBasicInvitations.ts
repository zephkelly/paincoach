import { H3Event } from "h3";
import { DatabaseService } from "~~/server/services/databaseService";
import type { PaginatedResponse } from "@@/shared/types/pagination";
import { BasicUserInvitationValidator } from "@@/shared/schemas/v1/user/invitation/basic";
import type { BasicUserInvitation } from '@@/shared/types/v1/user/invitation/basic';

import { getCachedInvitationsCount } from './getInvitationsCount';



/**
 * Get basic invitation details with pagination support
 * @param token - Invitation token to look up
 * @param page - Page number (defaults to 1)
 * @param items - Number of items per page (defaults to 10)
 * @param offset - Optional explicit offset (overrides page calculation if provided)
 * @returns Promise<PaginatedResponse<LimitedUserInvitation>> - Paginated invitation details
 */
export async function getBasicInvitations(
    event: H3Event,
    page: number = 1, 
    items: number = 10, 
    offset?: number
): Promise<PaginatedResponse<BasicUserInvitation>> {
    if (page < 1) {
        throw createError({
            statusCode: 400,
            message: 'Page must be at least 1',
        });
    }

    if (items < 1) {
        throw createError({
            statusCode: 400,
            message: 'Items per page must be at least 1',
        });
    }

    if (offset !== undefined && offset < 0) {
        throw createError({
            statusCode: 400,
            message: 'Offset cannot be negative',
        });
    }


    // Calculate the actual offset - either use explicit offset if provided, or calculate from page and items
    const calculatedOffset = offset !== undefined ? offset : (page - 1) * items;
    
    // First, get the total count for pagination metadata
    const totalInvitationsCount = await getCachedInvitationsCount(event);
    
    if (totalInvitationsCount === 0) {
        throw createError({
            statusCode: 404,
            message: 'Invitations not found',
        });
    }
    const db = DatabaseService.getInstance();
    
    const basicInvitations = await db.query<BasicUserInvitation>(`
        SELECT
            ui.public_user_id,
            ui.email,
            ui.primary_role,
            ui.roles,
            ui.invitation_token,
            ui.expires_at,
            ui.current_status,
            u.first_name as inviter_name,
            u.profile_url as inviter_profile_url,
            linked_user.public_id as linked_user_public_id
        FROM invitation.user_invitation_with_status ui
        JOIN private.user u ON ui.invited_by_user_id = u.id
        LEFT JOIN private.user linked_user ON ui.linked_user_id = linked_user.id
        LIMIT $1 OFFSET $2
    `, [items, calculatedOffset]);

    // Validate invitations
    const validatedInvitations: BasicUserInvitation[] = BasicUserInvitationValidator.validateArray(basicInvitations);

    if (validatedInvitations.length === 0) {
        throw createError({
            statusCode: 404,
            message: 'No invitations found',
        });
    }
    
    // Calculate total pages
    const totalPages = Math.ceil(totalInvitationsCount / items);
    
    // Return the paginated response
    return {
        data: validatedInvitations,
        pagination: {
            total: totalInvitationsCount,
            page,
            items,
            pages: totalPages,
            offset: calculatedOffset
        }
    };
}