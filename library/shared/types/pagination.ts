/**
 * Pagination metadata for paginated responses
 */
export interface PaginationMeta {
    /** Total number of items across all pages */
    total: number;
    /** Current page number (1-indexed) */
    page: number;
    /** Number of items per page */
    items: number;
    /** Total number of pages */
    pages: number;
    /** Current offset (calculated or explicitly provided) */
    offset: number;
}
  
/**
 * Generic paginated response containing data of type T and pagination metadata
 */
export interface PaginatedResponse<T> {
    /** Array of data items */
    data: T[];
    /** Pagination metadata */
    pagination: PaginationMeta;
}
  
/**
 * Pagination parameters that can be passed to API functions
 */
export interface PaginationParams {
    /** Page number (defaults to 1) */
    page?: number;
    /** Number of items per page (defaults to 10) */
    items?: number;
    /** Optional explicit offset (overrides page calculation if provided) */
    offset?: number;
}
  
/**
 * Default pagination values
 */
export const DEFAULT_PAGINATION = {
    ITEMS_PER_PAGE: 10,
    PAGE: 1
};
  
/**
 * Helper function to calculate pagination values from params
 * @param params - Pagination parameters
 * @returns Calculated pagination values
 */
export function calculatePagination(params: PaginationParams): {
    itemsPerPage: number;
    currentPage: number;
    offset: number;
} {
    const itemsPerPage = params.items || DEFAULT_PAGINATION.ITEMS_PER_PAGE;
    const currentPage = params.page || DEFAULT_PAGINATION.PAGE;
    const offset = params.offset !== undefined 
        ? params.offset 
        : (currentPage - 1) * itemsPerPage;
    
    return {
        itemsPerPage,
        currentPage,
        offset
    };
}