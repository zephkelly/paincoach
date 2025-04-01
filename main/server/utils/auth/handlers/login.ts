import { H3Event, H3Error } from 'h3'
import { type UserSession } from '#auth-utils'

import type { UserLoginVerificationData } from '@@/shared/types/v1/user/login/ verify'

import { UserRepository } from '~~/server/repositories/user'



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

    const randomString = Math.random().toString(36).substring(2, 15);
    
    try {
        const user: UserLoginVerificationData | undefined = await UserRepository.getUserLoginData({
            email: email,
        });

        const hashedInputPassword = await hashPassword(password);

        if (!user) {
            await verifyPassword(hashedInputPassword, randomString);

            throw createError({
                statusCode: 400,
                statusMessage: 'Email or password is incorrect'
            })
        }

        const storedPasswordHash = user?.password_hash;

        const isValidPassword = await verifyPassword(storedPasswordHash, password);
        if (!isValidPassword) {
            await verifyPassword(hashedInputPassword, randomString);

            throw createError({
                statusCode: 400,
                statusMessage: 'Email or password is incorrect'
            })
        }

        const session: UserSession = {
            user: {
                public_id: user.public_id,
                first_name: user.first_name,

                primary_role: user.primary_role,
                roles: user.roles,

                verified: user.verified,
                profile_url: user.profile_url || undefined,
            },
            secure: {
                id: user.id,
                public_id: user.public_id,
                
                email: user.email,
                primary_role: user.primary_role,
                roles: user.roles,

                verified: user.verified,
            },
            
            logged_in_at: new Date(),
            version: 1,
        }

        await clearUserSession(event);
                
        await setUserSession(event, session, {
            maxAge: 60 * 60 * 24 * 365 * 1,
        });
        
        setResponseStatus(event, 200, 'Ok')
        
        return {
            statusCode: 200,
            statusMessage: 'Ok',
            roles: user.roles,
            primary_role: user.primary_role
        }
    }
    catch(error: unknown) {
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