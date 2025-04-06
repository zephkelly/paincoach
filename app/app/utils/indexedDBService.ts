const DB_NAME = 'paincoach-app';
const DB_VERSION = 1;
const PENDING_REQUESTS_STORE = 'pendingRequests';
const USER_DATA_STORE = 'userData';



/**
 * Open a connection to the IndexedDB database
 */
export const openDatabase = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = (event) => {
            reject(new Error('Failed to open database'));
        };
        
        request.onsuccess = (event) => {
            resolve(request.result);
        };
        
        request.onupgradeneeded = (event) => {
            const db = request.result;
            
            // Create a store for pending API requests
            if (!db.objectStoreNames.contains(PENDING_REQUESTS_STORE)) {
                const store = db.createObjectStore(PENDING_REQUESTS_STORE, { keyPath: 'id' });
                store.createIndex('by-timestamp', 'timestamp');
            }
            
            // Create a store for user data
            if (!db.objectStoreNames.contains(USER_DATA_STORE)) {
                db.createObjectStore(USER_DATA_STORE, { keyPath: 'id' });
            }
        };
    });
};

/**
 * Add a pending request to the database
 */
export const addPendingRequest = async (request: {
  url: string;
  method: string;
  body: any;
}): Promise<string> => {
    const db = await openDatabase();
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(PENDING_REQUESTS_STORE, 'readwrite');
        const store = transaction.objectStore(PENDING_REQUESTS_STORE);
        
        const requestObj = {
            id,
            ...request,
            timestamp: Date.now()
        };
        
        const addRequest = store.add(requestObj);
        
        addRequest.onsuccess = () => {
            resolve(id);
        };
        
        addRequest.onerror = () => {
            reject(new Error('Failed to add pending request'));
        };
        
        transaction.oncomplete = () => {
            db.close();
        };
    });
};

/**
 * Save user data to the database
 */
export const savePendingUserData = async (key: string, data: any): Promise<boolean> => {
    try {
        const db = await openDatabase();
        
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(USER_DATA_STORE, 'readwrite');
            const store = transaction.objectStore(USER_DATA_STORE);
            
            const putRequest = store.put({ id: key, ...data });
            
            putRequest.onsuccess = () => {
                resolve(true);
            };
            
            putRequest.onerror = () => {
                reject(new Error('Failed to save user data'));
            };
            
            transaction.oncomplete = () => {
                db.close();
            };
        });
    }
    catch (error) {
        console.error("Error saving user data:", error);
        return false;
    }
};

/**
 * Get user data from the database
 */
export const getUserData = async (key: string): Promise<any> => {
    const db = await openDatabase();
    
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(USER_DATA_STORE, 'readonly');
        const store = transaction.objectStore(USER_DATA_STORE);
        
        const getRequest = store.get(key);
        
        getRequest.onsuccess = () => {
            resolve(getRequest.result);
        };
        
        getRequest.onerror = () => {
            reject(new Error('Failed to get user data'));
        };
        
        transaction.oncomplete = () => {
            db.close();
        };
    });
};

/**
 * Get all pending requests sorted by timestamp
 */
export const getPendingRequests = async (): Promise<any[]> => {
    const db = await openDatabase();
    
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(PENDING_REQUESTS_STORE, 'readonly');
        const store = transaction.objectStore(PENDING_REQUESTS_STORE);
        const index = store.index('by-timestamp');
        
        const getAllRequest = index.getAll();
        
        getAllRequest.onsuccess = () => {
            resolve(getAllRequest.result);
        };
        
        getAllRequest.onerror = () => {
            reject(new Error('Failed to get pending requests'));
        };
        
        transaction.oncomplete = () => {
            db.close();
        };
    });
};

/**
 * Remove a pending request from the database
 */
export const removePendingRequest = async (id: string): Promise<boolean> => {
    const db = await openDatabase();
    
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(PENDING_REQUESTS_STORE, 'readwrite');
        const store = transaction.objectStore(PENDING_REQUESTS_STORE);
        
        const deleteRequest = store.delete(id);
        
        deleteRequest.onsuccess = () => {
            resolve(true);
        };
        
        deleteRequest.onerror = () => {
            reject(new Error('Failed to remove pending request'));
        };
        
        transaction.oncomplete = () => {
            db.close();
        };
    });
};

/**
 * Clear all pending requests from the database
 */
export const clearAllPendingRequests = async (): Promise<boolean> => {
    const db = await openDatabase();
    
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(PENDING_REQUESTS_STORE, 'readwrite');
        const store = transaction.objectStore(PENDING_REQUESTS_STORE);
        
        const clearRequest = store.clear();
        
        clearRequest.onsuccess = () => {
            resolve(true);
        };
        
        clearRequest.onerror = () => {
            reject(new Error('Failed to clear pending requests'));
        };
        
        transaction.oncomplete = () => {
            db.close();
        };
    });
};