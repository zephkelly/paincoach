import { debounce } from ".";

/**
 * Helper to create a debounced watcher
 * 
 * @param {WatchSource<T>} source - The source to watch
 * @param {(value: T, oldValue: T) => void} callback - The callback to invoke
 * @param {number} [wait=300] - The number of milliseconds to delay
 * @param {object} [options] - The watch options
 * @returns {() => void} - Returns the watch stop function
 */
export function debouncedWatch<T>(
    source: any, // Using any here because Vue 3 has complex typing for watch sources
    callback: (value: T, oldValue: T) => void, 
    wait = 300,
    options?: { immediate?: boolean; deep?: boolean }
  ) {
    // Create a debounced version of the callback
    const debouncedCallback = debounce(callback, wait);
    
    // Return the watch with the debounced callback
    return watch(source, debouncedCallback, options);
  }