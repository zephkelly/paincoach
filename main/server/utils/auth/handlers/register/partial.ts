import { H3Event } from 'h3'
import { type UserSession } from '#auth-utils'
import type { DBUser, Role } from '~~lib/shared/types/users'
import { validateUUID } from '~lib/schemas/primitives'
import { DatabaseService } from '~~/server/services/databaseService'
import { InvitationStatusSchema } from '@@/shared/schemas/user/invitation'

/**
 * Handles partial registration completion (password setup only)
 * Used when an admin/clinician has already created the user account
 * and the user only needs to set their password
 */
export async function handlePartialRegistration(
    event: H3Event,
    body: {
        invitation_token: string,
        password: string,
        confirm_password: string
    }
) {
    const { invitation_token, password, confirm_password } = body

    if (!invitation_token) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invitation token is required'
        })
    }

    if (!password || !confirm_password) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Password and confirmation are required'
        })
    }

    if (password !== confirm_password) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Passwords do not match'
        })
    }

    const databaseServiceInstance = DatabaseService.getInstance()
    const transaction = await databaseServiceInstance.createTransaction()

    try {
        // Find the invitation by token
        const invitation = await transaction.query(`
      SELECT * FROM private.user_invitation 
      WHERE invitation_token = $1 
        AND status = $2 
        AND expires_at > NOW()
    `, [invitation_token, InvitationStatusSchema.Enum.pending])

        if (!invitation || invitation.length === 0) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Invalid or expired invitation token'
            })
        }

        // For partial registration, user should already exist
        if (!invitation[0].user_id) {
            throw createError({
                statusCode: 500,
                statusMessage: 'User ID not found in invitation'
            })
        }

        // Update existing user with password and mark registration as complete
        const password_hash = await hashPassword(password)

        const [updatedUser] = await transaction.query<DBUser>(`
            UPDATE private.user
            SET 
                password_hash = $1, 
                registration_complete = true, 
                updated_at = NOW()
            WHERE id = $2
            RETURNING 
                id, 
                email, 
                first_name, 
                last_name, 
                phone_number, 
                role_id, 
                verified, 
                version
        `, [password_hash, invitation[0].user_id])

        if (!updatedUser) {
            throw new Error('Error updating user registration');
        }

        // Update invitation status
        await transaction.query(`
            UPDATE private.user_invitation 
            SET 
                status = $1, 
                updated_at = NOW() 
            WHERE invitation_token = $2
        `, [InvitationStatusSchema.Enum.completed, invitation_token])

        // Get user role
        const roleResult = await transaction.query(`
            SELECT name FROM private.role WHERE id = $1
        `, [updatedUser.role_id])

        const userRole = roleResult[0].name as Role

        // Set up user session
        const validatedUserId = validateUUID(updatedUser.id)
        const userSession: UserSession = {
            user: {
                user_id: validatedUserId,
                first_name: updatedUser.first_name,
                verified: updatedUser.verified,
                user_role: userRole,
                profile_url: updatedUser.profile_url || undefined,
            },
            secure: {
                user_id: validatedUserId,
                email: updatedUser.email,
                verified: updatedUser.verified,
                user_role: userRole,
            },
            verified: updatedUser.verified,
            logged_in_at: new Date(),
            version: updatedUser.version
        }

        await transaction.commit()

        await replaceUserSession(event, userSession, {
            maxAge: 60 * 60 * 24 * 365
        })


        return {
            statusCode: 200,
            statusMessage: 'Registration completed successfully',
            data: {
                user: updatedUser
            }
        }
    } catch (error: any) {
        await transaction.rollback()

        if (error.statusCode) {
            throw error
        }

        console.error("handlePartialRegistration: Error completing registration:", error)

        throw createError({
            statusCode: 500,
            statusMessage: 'Internal server error'
        })
    }
}