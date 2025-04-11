import pg from 'pg'

declare module 'nitropack' {
    interface NitroApp {
        database: pg.Pool
    }
}

export default defineNitroPlugin(async (nitroApp) => {
    const config = useRuntimeConfig()
    
    const pool = new pg.Pool({
        connectionString: config.databaseConnectionString,
        ssl: {
            rejectUnauthorized: false
        }
    })

    // Test connection
    try {
        const client = await pool.connect()
        console.log('Connected to the database')
        client.release()
    }
    catch (err) {
        console.error('Error connecting to the database', err)
        throw err
    }

    async function createTablesIfNotExist() {
        const client = await pool.connect()
        try {
            await client.query(`
                CREATE SCHEMA IF NOT EXISTS "private"
            `)

            await client.query(`
                CREATE TABLE IF NOT EXISTS "private".users (
                    id SERIAL PRIMARY KEY,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    unsubscribe_token CHAR(18) UNIQUE NOT NULL,
                    mailing_list BOOLEAN DEFAULT TRUE,
                    demo_token CHAR(10) UNIQUE NOT NULL,
                    demo_visit_count INTEGER DEFAULT 0
                )
            `)

            console.log('Tables created or already exists')
        }
        catch (err) {
            console.error('Error creating tables', err)
            throw err
        }
        finally {
            client.release()
        }
    }

    await createTablesIfNotExist()

    //@ts-expect-error
    nitroApp.database = pool
})