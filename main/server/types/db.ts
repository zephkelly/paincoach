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
    query: <T = any>(query: string, params?: any[]) => Promise<T[]>
    
    /**
     * Commit the transaction
     */
    commit: () => Promise<void>
    
    /**
     * Rollback the transaction
     */
    rollback: () => Promise<void>
}

// Helper type for query parameters
export type QueryParams = any[] | undefined