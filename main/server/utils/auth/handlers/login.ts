import { H3Event, H3Error } from 'h3'
// import { type UserSession } from '#auth-utils'
// import { validateUUID } from '~lib/schemas/primitives'
// import { type DBUser, type User } from '~lib/types/users'
import { getUser } from '~~/server/utils/user/database/get/byEmail'
import { DatabaseService } from '~~/server/services/databaseService'
import type { BaseUserWithRoles } from '@@/shared/types/users/base'



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
        const user: BaseUserWithRoles | undefined = await getUser(transaction, email);

        if (!user) {
            throw createError({
                statusCode: 404,
                statusMessage: 'User not found'
            })
        }

        console.log(user)

        transaction.commit()

        return
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
    
    // try {
    //     // Get basic user info
    //     const user: DBUser | undefined = await getDBUser(transaction, email);
        
    //     if (!user) {
    //         throw createError({
    //             statusCode: 404,
    //             statusMessage: 'User not found'
    //         })
    //     }
        
    //     if (user.verified === false || user.status !== 'active' || user.password_hash === undefined || user.password_hash === null) {
    //         throw createError({
    //             statusCode: 403,
    //             statusMessage: 'User has not completed registration'
    //         })
    //     }
        
    //     if (await verifyPassword(user.password_hash, password) === false) {
    //         throw createError({
    //             statusCode: 401,
    //             statusMessage: 'Invalid credentials'
    //         })
    //     }
        
    //     // Get user roles from the new user_role table
    //     const userRoles = await transaction.query(
    //         `SELECT r.name as role, ur.is_primary 
    //          FROM private.user_role ur
    //          JOIN private.role r ON ur.role_id = r.id
    //          WHERE ur.user_id = $1`,
    //         [user.id]
    //     );
        
    //     // Extract roles information
    //     const roles: UserRole[] = userRoles.rows.map(row => row.role);
        
    //     // Determine primary role
    //     // First try to find a role marked as primary
    //     let primaryRole = userRoles.rows.find(row => row.is_primary === true)?.role;
        
    //     // If no primary role is explicitly set, fall back to the legacy role or first available role
    //     if (!primaryRole) {
    //         primaryRole = user.role || roles[0];
    //     }
        
    //     // Check if user has owner status (for admins)
    //     const isOwner = roles.includes('admin') && user.owner === true;
        
    //     const validatedUserId = validateUUID(user.id);
        
    //     // Create session with multi-role support
    //     const session: UserSession = {
    //         user: {
    //             user_id: validatedUserId,
    //             first_name: user.first_name,
    //             user_roles: roles,
    //             primary_role: primaryRole,
    //             verified: user.verified,
    //             profile_url: user.profile_url || undefined,
    //         },
    //         secure: {
    //             email: user.email,
    //             verified: user.verified,
    //             user_id: validatedUserId,
    //             user_roles: roles,
    //             primary_role: primaryRole,
    //         },
    //         verified: user.verified,
    //         logged_in_at: new Date(),
    //         version: user.version,
    //         // Add helper method for role checking
    //         hasRole: function(role) {
    //             const rolesToCheck = Array.isArray(role) ? role : [role];
    //             return rolesToCheck.some(r => this.secure.user_roles.includes(r));
    //         }
    //     }
        
    //     await replaceUserSession(event, session, {
    //         maxAge: 60 * 60 * 24 * 365 * 1,
    //     });
        
    //     setResponseStatus(event, 200, 'Ok')
    //     transaction.commit();
        
    //     return {
    //         statusCode: 200,
    //         statusMessage: 'Ok',
    //         roles: roles,
    //         primary_role: primaryRole
    //     }
    // }
    // catch (error: unknown) {
    //     transaction.rollback();
        
    //     if (error instanceof H3Error) {
    //         throw error
    //     }
        
    //     console.error(error)
    //     throw createError({
    //         statusCode: 500,
    //         statusMessage: 'Internal server error'
    //     })
    // }
}