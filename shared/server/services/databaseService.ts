import pg from 'pg';
import type { QueryParams, DBTransaction } from '../types/db'

import type { DBCacheKey, DBCacheValue, TypedCacheEntry } from '../types/cache'


let globalPool: pg.Pool | undefined = undefined

export class DatabaseService {
    private static instance: DatabaseService;
    private queryCache: Map<DBCacheKey, TypedCacheEntry<DBCacheKey>>
    private cacheTTL: number
    private cacheCleanupInterval: NodeJS.Timeout | null = null
    private activeConnections: Set<any>
    private isShuttingDown: boolean
    
    constructor() { // 1 day cache
        this.queryCache = new Map()
        this.cacheTTL = 1000 * 60 * 60 * 24 * 1
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

        this.setupCacheCleanup()
    }

    public static getInstance(): DatabaseService {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
        }
        return DatabaseService.instance;
    }
    
    private getMemoryUsage(): { cacheSize: string } {
        // Calculate cache size in bytes first
        const cacheSizeBytes = Array.from(this.queryCache.entries())
            .reduce((size, [key, value]) => {
                return size + new TextEncoder().encode(JSON.stringify({ key, value })).length;
            }, 0);

        // Convert to KB
        const cacheSize = cacheSizeBytes / 1024;

        return {
            cacheSize: `${cacheSize.toFixed(2)} KB`
        };
    }

    
    private readonly MAX_SAFE_COUNTER = 1000000 // 1 million
    private readonly MAX_SAFE_MULTIPLIER = 1000000
    private readonly LOG_EVERY_N_REQUESTS: number = 100
    
    private totalRequestsProcessed: bigint = BigInt(0)
    private requestCounterMultiplier: number = 1
    private requestCounter: number = 0
    private checkAndLogMemoryUsage() {
        this.totalRequestsProcessed++;

        this.requestCounter++;
        if (this.requestCounter >= this.MAX_SAFE_COUNTER) {
            this.requestCounter = 1;
            this.requestCounterMultiplier++;
            
            // Reset multiplier if it gets too large
            if (this.requestCounterMultiplier >= this.MAX_SAFE_MULTIPLIER) {
                this.requestCounterMultiplier = 1;
            }
        }

        if (this.totalRequestsProcessed % BigInt(this.LOG_EVERY_N_REQUESTS) === BigInt(0)) {
            const { cacheSize } = this.getMemoryUsage();

            console.log();
            console.log('//---------- In-Mem Cache Stats: ----------//');
            console.log(`     * Entries: ${this.queryCache.size}`);
            console.log(`     * Estimated Cache Size: ${cacheSize}`);
            console.log('//-----------------------------------------//');
            console.log(`** ${this.totalRequestsProcessed} requests processed since last log. **`);
            console.log();
        }

        this.requestCounter = 0;
        this.requestCounterMultiplier++;
        
        // Reset multiplier if it gets too large
        if (this.requestCounterMultiplier >= this.MAX_SAFE_MULTIPLIER) {
            this.requestCounterMultiplier = 1;
        }
    }

    private setupCacheCleanup() {
        this.cacheCleanupInterval = setInterval(() => {
            if (!this.isShuttingDown) {
                const now = Date.now()
                for (const [key, value] of this.queryCache.entries()) {
                    if (now - value.timestamp > this.cacheTTL) {
                        this.queryCache.delete(key)
                    }
                }
            }
        }, 60000)
    }

    public insertIntoCache<K extends DBCacheKey>(key: K, data: DBCacheValue<K>) {
        this.queryCache.set(key, {
            timestamp: Date.now(),
            data
        });
    }

    public invalidateCacheKeys(keys: DBCacheKey[]) {
        keys.forEach(key => {
            this.queryCache.delete(key);
        });
    }

    public invalidateCache() {
        this.queryCache.clear();
    }

    private async executeWithCache<K extends DBCacheKey, T>(
        client: any,
        query: string,
        params?: QueryParams,
        key?: K,
        invalidateKeys?: DBCacheKey[],
        ttl: number = this.cacheTTL
    ): Promise<T> {
        this.invalidateCacheKeys(invalidateKeys || []);
        
        if (key) {
            this.checkAndLogMemoryUsage();
            const cached = this.queryCache.get(key);
            if (cached && Date.now() - cached.timestamp < ttl) {
                return cached.data as T;
            }
            this.queryCache.delete(key);
        }

        const result = (await client.query(query, params)).rows;

        if (key) {
            this.queryCache.set(key, {
                timestamp: Date.now(),
                data: result
            });
        }

        return result
    }

    public async query<T = any>(
        query: string,
        params?: QueryParams,
        key?: DBCacheKey,
        invalidateKeys?: DBCacheKey[],
        ttl: number = this.cacheTTL
    ): Promise<T[]> {
        if (this.isShuttingDown) {
            throw new Error('Server is shutting down')
        }

        if (!globalPool) {
            throw new Error('Database pool not initialized')
        }

        const client = await globalPool.connect();
        
        try {
            if (key) {
                return this.executeWithCache<typeof key, T[]>(
                    client, 
                    query, 
                    params, 
                    key, 
                    invalidateKeys, 
                    ttl
                );
            }
            return (await client.query(query, params)).rows;
        } finally {
            client.release();
        }
    }

    /* ONLY USE THIS DIRECTLY IN API ROUTES, TOO DIFFICULT TO PASS AROUND
    * This method is used to create a transaction for a set of queries.
    * It will return a transaction object that can be used to execute queries.
    * The transaction object has the following methods:
    * - query: Execute a query within the transaction
    * - commit: Commit the transaction
    * - rollback: Rollback the transaction
    */
    public async createTransaction(timeoutMs: number = 30000): Promise<DBTransaction> {
        if (this.isShuttingDown) {
            throw new Error('Server is shutting down')
        }

        if (!globalPool) {
            throw new Error('Database pool not initialized')
        }

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
                    key?: DBCacheKey,
                    invalidateKeys?: DBCacheKey[],
                    ttl: number = this.cacheTTL
                ): Promise<T[]> => {
                    if (!isActive) throw new Error('Transaction already completed')
                    if (this.isShuttingDown) throw new Error('Server is shutting down')

                    if (key) {
                        return this.executeWithCache<typeof key, DBCacheValue<typeof key>>(
                            client,
                            query,
                            params,
                            key,
                            invalidateKeys,
                            this.cacheTTL
                        ) as unknown as T[];
                    }
    
                    // If no cache key, just execute the query
                    return (await client.query(query, params)).rows;
                },
                commit: async () => {
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

    // public async createTablesIfNotExist() {
    //     if (config.environment === 'production') {
    //         return;
    //     }

    //     const transaction = await this.createTransaction();
        
    //     try {
    //         // await createTables(transaction);
    
    //         await transaction.commit();
    //     }
    //     catch (error: any) {
    //         await transaction.rollback();
    //         console.error('createTablesIfNotExist', error);
    //     }
    // }

    async shutdown(): Promise<void> {
        this.isShuttingDown = true

        if (this.cacheCleanupInterval) {
            clearInterval(this.cacheCleanupInterval)
            this.cacheCleanupInterval = null
        }

        this.queryCache.clear()

        // Wait for active connections to finish (with timeout)
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