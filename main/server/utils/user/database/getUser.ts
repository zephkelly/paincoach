import { H3Event } from 'h3'
import { type DBTransaction } from '~~/server/types/db'

import {type User } from '~~lib/shared/types/users'
import { validateUser } from '~~lib/shared/schemas/users'

import { DatabaseService } from '~~/server/services/databaseService';



export async function getUserExists(transaction: DBTransaction, email: string): Promise<boolean> {
    if (!email) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Email is required'
        })
    }

    const rows = await transaction.query<{ exists: boolean }>(`
            SELECT EXISTS (
                SELECT 1
                FROM private.user
                WHERE email = $1
            )
        `, 
        [email]
    )

    if (rows.length === 0 || !rows[0]) {
        return false
    }

    return rows[0].exists
}


export async function getUser(email: string): Promise<User | undefined> {
    try {
        const db = DatabaseService.getInstance()

        if (!email) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Email is required'
            })
        }
    
        const rows = await db.query<User>(`
            SELECT *
            FROM private.user
            WHERE email = $1
        `, [email])
            
        if (rows.length === 0 || !rows[0]) {
            return undefined
        }

        const validatedUser = validateUser(rows[0])
        return validatedUser
    }
    catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Error getting user'
        })
    }   
}