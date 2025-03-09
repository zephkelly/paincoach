import { H3Event } from 'h3'
import { DatabaseService } from '~~/server/services/databaseService'
import { RegistrationTypeSchema, InvitationStatusSchema } from '@@/shared/schemas/users/invitation'
import type { UserRole } from '@@/shared/types/users'
import { handlePartialRegistration } from './partial'
import { handleFullRegistration } from './full'



/**
 * Main registration handler that determines registration type
 * from the invitation and delegates to the appropriate handler
 */
export async function handleRegisterCredentials(
    event: H3Event,
    desired_role: UserRole,
    body: {
        invitation_token: string,
        password?: string,
        confirm_password?: string,
        first_name?: string,
        last_name?: string,
        phone_number?: string,
        email?: string,
        [key: string]: any
    }
) {
    const { invitation_token } = body

    if (!invitation_token) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invitation token is required'
        })
    }

    const databaseServiceInstance = DatabaseService.getInstance()

    try {
        // Find the invitation by token
        const invitation = await databaseServiceInstance.query(`
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

        // Determine registration type and delegate to appropriate handler
        const registrationType = invitation[0].registration_type

        if (registrationType === RegistrationTypeSchema.Enum.partial) {
            return await handlePartialRegistration(event, {
                invitation_token,
                password: body.password || '',
                confirm_password: body.confirm_password || ''
            })
        }
        else if (registrationType === RegistrationTypeSchema.Enum.full) {
            return await handleFullRegistration(event, desired_role, {
                invitation_token,
                email: body.email || '',
                password: body.password || '',
                confirm_password: body.confirm_password || '',
                first_name: body.first_name || '',
                last_name: body.last_name,
                phone_number: body.phone_number
            })
        }
        else {
            throw createError({
                statusCode: 400,
                statusMessage: 'Invalid registration type'
            })
        }
    }
    catch (error: any) {
        if (error.statusCode) {
            throw error
        }

        console.error("handleRegisterCredentials: Error processing registration:", error)

        throw createError({
            statusCode: 500,
            statusMessage: 'Internal server error'
        })
    }
}