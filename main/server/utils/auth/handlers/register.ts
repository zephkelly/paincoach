import { H3Event } from 'h3'
import { type UserSession } from '#auth-utils'

import { validateUUID } from '~lib/schemas/primitives'

import { createUser } from '~~/server/utils/user/database/createUser'
import { getUserExists } from '~~/server/utils/user/database/getUser'

import { DatabaseService } from '~~/server/services/databaseService'
import { UserRoleSchema } from '@@/shared/schemas/users'



export async function handleRegisterCredentials(
    event: H3Event,
    body: {
        email: string,
        password: string,
        confirm_password: string,
        name: string
    }
) {
    const databaseServiceInstance = DatabaseService.getInstance()

    const { email, name, password, confirm_password } = body
    
    if (!password || !confirm_password || !email || !name) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid or missing credentials'
        })
    }
    
    if (password !== confirm_password) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Passwords do not match'
        })
    }

    try {
        const transaction = await databaseServiceInstance.createTransaction()
        const userExists = await getUserExists(transaction, email)

        if (userExists) {
            throw createError({
                statusCode: 409,
                statusMessage: 'That email is already in use'
            })
        }

        const password_hash = await hashPassword(password)

        const newUser = await createUser(transaction,
            'patient',
            name,
            email,
            password_hash
        )

        const newValidatedUserId = validateUUID(newUser.id);

        await transaction.commit()

        const userSession: UserSession = {
            user: {
                user_id: newValidatedUserId,
                name: newUser.first_name,
                email: newUser.email,
                user_role: UserRoleSchema.Enum.patient,
            },
            secure: {
                user_id: newValidatedUserId,
                email: newUser.email,
                verified: newUser.verified,
                user_role: UserRoleSchema.Enum.patient,
            },
            verified: newUser.verified,
            logged_in_at: new Date(),
            version: newUser.version
        }

        await replaceUserSession(event, userSession, {
            maxAge: 60 * 60 * 24 * 365
        })
    
        // try {
        //     await authenticationServiceInstance.sendVerificationEmail(email);
        // }
        // catch (error) {
        //     console.error('handleRegister: Error sending transactional email to user:', error)
        // }

        // try {
        //     const config = await useRuntimeConfig()

        //     await emailServiceInstance.sendEmail({
        //         from: config.aws.ses.updates,
        //         to: config.aws.ses.updatesDestination,
        //         subject: 'New user registered!',
        //         html: `
        //             <h1>New user registered!</h1>
        //             <p>(${newUser.name}) ${newUser.email}, has registered for an account.</p>
        //         `
        //     })
        // }
        // catch (error) {
        //     console.error('handleRegister: Error sending email to updates:', error)
        // }

        setResponseStatus(event, 201, 'Ok')
        return {
            statusCode: 201,
            statusMessage: 'User Created successfully',
            data: {
                user: newUser
            }
        }
    }
    catch (error: any) {
        if (error.statusCode) {
            throw error
        }
        
        console.error("handleRegister: Error registering user:", error)
        
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal server error'
        })
    }
}