import type { DBCacheKey, DBCacheValue } from './cache'


/**
 * Database transaction object returned by createTransaction
 */
export interface DBTransaction {
    /**
     * Execute a query within the transaction
     * @param query SQL query string
     * @param params Query parameters
     * @returns Query results
     */
    query: <T = any>(query: string, params?: any[], key?: DBCacheKey, invalidateKeys?: DBCacheKey[]) => Promise<T[]>
    
    /**
     * Commit the transaction
     */
    commit: () => Promise<void>
    
    /**
     * Rollback the transaction
     */
    rollback: () => Promise<void>
}

/**
 * Main database context available in databaseServiceInstance
 */
export interface DBContext {
    /**
     * Execute a single query with optional caching
     * @param query SQL query string
     * @param params Query parameters
     * @param key Cache key (optional)
     * @param invalidateKeys Cache keys to invalidate (optional)
     * @param ttl Cache TTL in milliseconds (optional)
     * @returns Query results
     */
    query: <T = any>(
        query: string,
        params?: any[],
        key?: DBCacheKey,
        invalidateKeys?: DBCacheKey[],
        ttl?: number
    ) => Promise<T[]>;
    
    /**
     * Create a new transaction
     * @param timeoutMs Transaction timeout in milliseconds (optional)
     * @returns Transaction object
     */
    createTransaction: (timeoutMs?: number) => Promise<DBTransaction>;

    /**
     * Invalidate specific cache entries
     * @param keys Array of cache keys to invalidate
     */
    invalidateCacheKeys: (keys: DBCacheKey[]) => void;

    /**
     * Insert data into cache
     * @param key Cache key
     * @param data Data to cache
     */
    insertIntoCache: <K extends DBCacheKey>(key: K, data: DBCacheValue<K>) => void;

    /**
     * Invalidate all cache entries
     */
    invalidateCache: () => void;
}

/**
 * Base database types for common columns
 */
export interface DBBaseEntity {
    created_at: Date
    updated_at: Date
    created_by?: string
}

/**
 * Common query options
 */
export interface DBQueryOptions {
    /** Cache key */
    cacheKey?: string
    /** Cache TTL in milliseconds */
    cacheTTL?: number
    /** Transaction to use */
    transaction?: DBTransaction
}


export interface CacheEntry<T> {
    timestamp: number
    data: T
}

/**
 * Error types specific to database operations
 */
export class DBError extends Error {
    constructor(
        message: string,
        public readonly code?: string,
        public readonly detail?: string
    ) {
        super(message)
        this.name = 'DBError'
    }
}

/**
 * Database operation result
 */
export interface DBResult<T> {
    success: boolean
    data?: T
    error?: DBError
}

// Pool configuration
export interface DBPoolConfig {
    connectionString: string
    ssl: {
        rejectUnauthorized: boolean
    }
    max: number
    min: number
    idleTimeoutMillis: number
    connectionTimeoutMillis: number
}

// Helper type for query parameters
export type QueryParams = any[] | undefined

// Query execution options
export interface QueryExecutionOptions {
    retry?: boolean
    maxRetries?: number
    retryDelay?: number
}