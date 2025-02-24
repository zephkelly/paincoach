import { H3Event } from "h3";

import { type User } from "~~lib/shared/types/users";
import { type UserRole } from "~~lib/shared/types/users";
import { type DBTransaction } from "~~/server/types/db";

import { validateUser } from "~~lib/shared/schemas/users";



export async function createUser(
    transaction: DBTransaction,
    userRole: UserRole,
    name: string,
    email: string,
    password_hash: string,
): Promise<User> {
    const rows = await transaction.query<User>(`
        INSERT INTO private.user (name, email, password_hash, version, user_type)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `, [name, email, password_hash, 0, userRole])

    const newUser = rows[0]

    if (!newUser) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to create user'
        })
    }

    const validatedUser = validateUser(newUser)

    if (!validatedUser) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to validate user'
        })
    }
    
    return validatedUser
}