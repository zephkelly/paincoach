import { PoolClient } from 'pg'
import { type User } from '@/types/user'

export async function createUser(user: User): Promise<void> {
    const nitroApp = useNitroApp()
    const client: PoolClient = await nitroApp.database.connect()
  
    try {
        await client.query(
            'INSERT INTO "private".users (email, demo_token) VALUES ($1, $2)',
            [user.email, user.demoToken]
        )
        console.log('User created.')
    }
    catch (error) {
        console.error('Error creating user:', error)
        throw error
    }
    finally {
        client.release()
    }
}
  
export async function incrementDemoViewCount(demoToken: string): Promise<void> {
    const nitroApp = useNitroApp()
    const client: PoolClient = await nitroApp.database.connect()
  
    try {
        const result = await client.query(
            'UPDATE "private".users SET demo_visit_count = demo_visit_count + 1 WHERE demo_token = $1 RETURNING demo_visit_count',
            [demoToken]
        )
    
        if (result.rowCount === 0) {
            throw new Error('User not found')
        }
    
        console.log(`Demo view count updated for token ${demoToken}. New count: ${result.rows[0].demo_visit_count}`)
    }
    catch (error) {
        console.error('Error updating demo view count:', error)
        throw error
    }
    finally {
        client.release()
    }
}

export async function checkUserByDemoToken(demoToken: string): Promise<boolean> {
    const nitroApp = useNitroApp()
    const client: PoolClient = await nitroApp.database.connect()
  
    try {
        const result = await client.query(
            'SELECT EXISTS(SELECT 1 FROM "private".users WHERE demo_token = $1)',
            [demoToken]
        )
        return result.rows[0].exists
    } catch (error) {
        console.error('Error checking user by demo token:', error)
        throw error
    } finally {
        client.release()
    }
}