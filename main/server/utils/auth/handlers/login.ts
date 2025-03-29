import { H3Event, H3Error } from 'h3'
import { type UserSession } from '#auth-utils'

import type { DBUserWithRoles } from '@@/shared/types/v1/user'

import { DatabaseService } from '~~/server/services/databaseService'
import { getDBUserWithRoles } from '~~/server/utils/user/database/get/byEmail'



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
    
    const transaction = await DatabaseService.getInstance().createTransaction()

    try {
        const user: DBUserWithRoles | undefined = await getDBUserWithRoles(transaction, email);

        if (!user) {
            throw createError({
                statusCode: 404,
                statusMessage: 'User not found'
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
                
        await replaceUserSession(event, session, {
            maxAge: 60 * 60 * 24 * 365 * 1,
        });
        
        setResponseStatus(event, 200, 'Ok')
        transaction.commit();
        
        return {
            statusCode: 200,
            statusMessage: 'Ok',
            roles: user.roles,
            primary_role: user.primary_role
        }
    }
    catch(error: unknown) {
        transaction.rollback()

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