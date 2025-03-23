import { H3Event } from 'h3'
import { type UserSession } from '#auth-utils'
import { validateUUID } from '~lib/schemas/primitives'
import { createUser } from '~~/server/utils/user/database/create'
import { getUserExists } from '~~/server/utils/user/database/get/exists'
import { DatabaseService } from '~~/server/services/databaseService'
import { InvitationStatusSchema } from '@@/shared/schemas/user/invitation'
import type { Role } from '@@/shared/types/users'



/**
 * Handles full registration process where the user completes all fields
 * Used when an admin/clinician has only created an invitation
 * and the user needs to fill out all their information
 */
export async function handleFullRegistration(
    event: H3Event,
    desired_role: Role,
    body: {
        invitation_token: string,
        email: string,
        password: string,
        confirm_password: string,
        first_name: string,
        last_name?: string,
        phone_number?: string,
        [key: string]: any
    }
) {
    const { invitation_token, email, password, confirm_password, first_name, last_name, phone_number } = body

    if (!invitation_token) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invitation token is required'
        })
    }

    if (!password || !confirm_password || !email || !first_name) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Required fields are missing'
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

        // Check if email matches invitation
        if (email !== invitation[0].email) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Email does not match invitation'
            })
        }

        // Check if email is already in use
        const userExists = await getUserExists(transaction, email)
        if (userExists) {
            throw createError({
                statusCode: 409,
                statusMessage: 'That email is already in use'
            })
        }

        // Get inviter's role for permission check
        const inviterRole = await getRoleNameFromUserId(transaction, invitation[0].invited_by)

        // Create new user with all provided information
        const password_hash = await hashPassword(password)
        const newUser = await createUser(
            transaction,
            desired_role,
            {
                email,
                first_name,
                last_name: last_name,
                phone_number: phone_number,
                password_hash,
                role_id: invitation[0].role_id,
                registration_complete: true
            },
            inviterRole
        )

        // Update invitation status
        await transaction.query(`
            UPDATE private.user_invitation 
            SET 
                status = $1, 
                user_id = $2, 
                updated_at = NOW() 
            WHERE invitation_token = $3
        `, [InvitationStatusSchema.Enum.completed, newUser.id, invitation_token])

        // Set up user session
        const newValidatedUserId = validateUUID(newUser.id)
        const userSession: UserSession = {
            user: {
                user_id: newValidatedUserId,
                first_name: newUser.first_name,
                verified: newUser.verified,
                user_role: desired_role,
                profile_url: newUser.profile_url || undefined
            },
            secure: {
                user_id: newValidatedUserId,
                email: newUser.email,
                verified: newUser.verified,
                user_role: desired_role,
            },
            verified: newUser.verified,
            logged_in_at: new Date(),
            version: newUser.version
        }

        await transaction.commit()

        await replaceUserSession(event, userSession, {
            maxAge: 60 * 60 * 24 * 365
        })

        setResponseStatus(event, 201)
        return newUser
    }
    catch (error: any) {
        await transaction.rollback()

        if (error.statusCode) {
            throw error
        }

        console.error("handleFullRegistration: Error registering user:", error)

        throw createError({
            statusCode: 500,
            statusMessage: 'Internal server error'
        })
    }
}

/**
 * Helper function to get role name from user ID
 */
async function getRoleNameFromUserId(transaction: any, userId: string): Promise<Role> {
    const result = await transaction.one(`
    SELECT r.name 
    FROM private.user u
    JOIN private.role r ON u.role_id = r.id
    WHERE u.id = $1
  `, [userId])

    return result.name as Role
}