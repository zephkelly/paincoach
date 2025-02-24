import pg from 'pg';
import type { QueryParams, DBTransaction } from '../types/db'



let globalPool: pg.Pool | undefined = undefined

export class DatabaseService {
    private static instance: DatabaseService;
    private activeConnections: Set<any>
    private isShuttingDown: boolean
    
    constructor() { // 1 day cache
        this.activeConnections = new Set()
        this.isShuttingDown = false
        
        const config = useRuntimeConfig();
        
        if (!globalPool) {
            globalPool = new pg.Pool({
                connectionString: config.databaseConnectionString as string,
                ssl: {
                    rejectUnauthorized: false
                },
                max: 20,
                min: 2,
                idleTimeoutMillis: 30000,
                connectionTimeoutMillis: 2000,
            })
        }
    }

    public static getInstance(): DatabaseService {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
        }
        return DatabaseService.instance;
    }

    public async query<T = any>(
        query: string,
        params?: QueryParams,
    ): Promise<T[]> {
        if (this.isShuttingDown) throw new Error('Server is shutting down')
        if (!globalPool) throw new Error('Database pool not initialized')

        const client = await globalPool.connect();
        
        try {
            const result = (await client.query(query, params)).rows;
    
            return result
        }
        finally {
            client.release();
        }
    }

    public async createTransaction(timeoutMs: number = 30000): Promise<DBTransaction> {
        if (!globalPool) throw new Error('Database pool not initialized')
        if (this.isShuttingDown) throw new Error('Server is shutting down')

        const client = await globalPool.connect()
        this.activeConnections.add(client)

        let isActive = true
        let timeoutId: NodeJS.Timeout

        const cleanup = async () => {
            if (isActive) {
                isActive = false
                clearTimeout(timeoutId)
                await client.query('ROLLBACK').catch(console.error)
                client.release()
                this.activeConnections.delete(client)
            }
        }

        try {
            await client.query('BEGIN')
            timeoutId = setTimeout(cleanup, timeoutMs)

            return {
                query: async <T = any>(
                    query: string,
                    params?: QueryParams,
                ): Promise<T[]> => {
                    if (!globalPool) throw new Error('Database pool not initialized')
                    if (!isActive) throw new Error('Transaction already completed')
                    if (this.isShuttingDown) throw new Error('Server is shutting down')

                    const result = (await client.query(query, params)).rows;

                    return result
                },
                commit: async () => {
                    if (!globalPool) throw new Error('Database pool not initialized')
                    if (!isActive) throw new Error('Transaction already completed')
                    if (this.isShuttingDown) throw new Error('Server is shutting down')
                    clearTimeout(timeoutId)
                    await client.query('COMMIT')
                    isActive = false
                    client.release()
                    this.activeConnections.delete(client)
                },
                rollback: cleanup
            }
        } catch (error) {
            await cleanup()
            throw error
        }
    }

    async shutdown(): Promise<void> {
        this.isShuttingDown = true

        const timeout = new Promise(resolve => setTimeout(resolve, 2000))
        const waitForConnections = new Promise(resolve => {
            const checkConnections = () => {
                if (this.activeConnections.size === 0) {
                    resolve(true)
                } else {
                    setTimeout(checkConnections, 100)
                }
            }
            checkConnections()
        })

        await Promise.race([waitForConnections, timeout])

        console.log('DatabaseService: Shutdown')
    }
}