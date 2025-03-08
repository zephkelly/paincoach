import { H3Event } from 'h3'
import { type UserSession, type SecureSessionData } from '#auth-utils'

import { validateUUID } from '~lib/schemas/primitives'

import { createUser } from '../../user/database/create'
import { getUserExists } from '../../user/database/get/exists'

import { DatabaseService } from '~~/server/services/databaseService'
import { UserRoleSchema } from '@@/shared/schemas/users'
import type { UserRole } from '@@/shared/types/users'



export async function handleRegisterCredentials(
    event: H3Event,
    desired_role: UserRole,
    body: {
        email: string,
        password: string,
        confirm_password: string,
        first_name: string,
        last_name: string,
        phone_number: string,
        [key: string]: any
    }
) {
    const session = await getUserSession(event) as UserSession
    const secureSession = session.secure as SecureSessionData

    if (!secureSession) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized'
        })
    }

    const databaseServiceInstance = DatabaseService.getInstance()

    const { email, phone_number, first_name, last_name, password, confirm_password } = body
    
    if (!password || !confirm_password || !email || !first_name || !last_name || !phone_number) {
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

    const transaction = await databaseServiceInstance.createTransaction()
    try {
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
            {
                ...body,
                password_hash: password_hash
            },
            secureSession.user_role
        )

        const newValidatedUserId = validateUUID(newUser.id);

        await transaction.commit()

        const userSession: UserSession = {
            user: {
                user_id: newValidatedUserId,
                first_name: newUser.first_name,
                verified: newUser.verified,
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
        await transaction.rollback()

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