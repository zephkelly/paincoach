import { H3Event, H3Error } from 'h3'
import { type UserSession } from '#auth-utils'

import { validateUUID } from '~lib/schemas/primitives'
import { type User } from '~lib/types/users'

import { getUser } from '~~/server/utils/user/database/getUser'


export async function handleLoginCredentials(
    event: H3Event,
    body: {
        email: string,
        password: string,
    }
) {
    const { email, password } = body
    
    if (!password || !email) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid or missing credentials'
        })
    }

    try {
        const user: User | undefined = await getUser(email);

        if (!user) {
            throw createError({
                statusCode: 404,
                statusMessage: 'User not found'
            })
        }

        if (await verifyPassword(user.password_hash, password) === false) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Invalid or credentials'
            })
        }

        const validatedUserId = validateUUID(user.id);
            
        const session: UserSession = {
            user: {
                user_id: validatedUserId,
                name: user.first_name,
                user_role: user.role,
                email: user.email,
            },
            secure: {
                email: user.email,
                verified: user.verified,
                user_id: validatedUserId,
                user_role: user.role,
            },
            verified: user.verified,
            logged_in_at: new Date(),
            version: user.version
        }

        await replaceUserSession(event, session,  {
            maxAge: 60 * 60 * 24 * 365 * 1, // 1 year
        });

        setResponseStatus(event, 200, 'Ok')
        return {
            statusCode: 200,
            statusMessage: 'Ok',
        }
    }
    catch (error: unknown) {
        if (error instanceof H3Error) {
            throw error
        }
        
        console.error(error)

        throw createError({
            statusCode: 500,
            statusMessage: 'Internal server error'
        })
    }
}