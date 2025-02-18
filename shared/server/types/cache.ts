export type DBCacheTypes = {
    'user': any;
}

export type DBCacheIdentifier = 'uuid' | 'slug' | 'id' | 'code' | 'email' | 'uuid-slug';


// Define base keys that always require an identifier
export type BaseKeysRequiringIdentifier = 'user'


// Keys that don't require identifiers (can be used directly)
export type DirectKeys = {
    [K in keyof DBCacheTypes]: K extends DBCacheTypes ? never : K
}[keyof DBCacheTypes];

// Combined cache key type with support for dynamic organization and display keys
export type DBCacheKey =
    | DirectKeys
    | `${BaseKeysRequiringIdentifier}-${DBCacheIdentifier}-${string | number}`
    
// Type to get the value type for a given cache key
export type DBCacheValue<K extends DBCacheKey> =
    K extends keyof DBCacheTypes
        ? DBCacheTypes[K]
        : K extends `${infer T extends keyof DBCacheTypes}-${DBCacheIdentifier}-${string | number}`
            ? DBCacheTypes[T]
            : never;

// Cache entry type with timestamp
export type TypedCacheEntry<K extends DBCacheKey> = {
    timestamp: number;
    data: DBCacheValue<K>;
}