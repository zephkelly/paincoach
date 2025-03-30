import { debounce } from "./";

/**
 * Creates a debounced computed property for Vue with flexible parameters
 * and proper SSR support that returns null during server-side rendering
 *
 * @param {Function} getter - The getter function
 * @param {Function|number} [setterOrWait] - Either the setter function or wait time
 * @param {number} [wait=300] - The number of milliseconds to delay (used when second param is setter)
 * @returns {WritableComputedRef<T>|ComputedRef<T>} - Returns a computed property
 */
export function debouncedComputed<T>(
    getter: () => T,
    setterOrWait?: ((value: T) => void) | number,
    maybeWait?: number
  ): ComputedRef<T> | WritableComputedRef<T> {
    // Default wait time
    let wait = 300;
    let setter: ((value: T) => void) | undefined = undefined;
    
    // Handle flexible parameters
    if (typeof setterOrWait === 'function') {
      // Second parameter is a setter function
      setter = setterOrWait;
      // Use third parameter as wait if provided
      if (typeof maybeWait === 'number') {
        wait = maybeWait;
      }
    } else if (typeof setterOrWait === 'number') {
      // Second parameter is wait time
      wait = setterOrWait;
    }
    
    // Create a ref to track if we're in browser
    const isBrowser = ref(import.meta.browser);
    
    // Create a ref to store the debounced value
    // Initialize with the actual value to avoid hydration mismatches
    const initialValue = getter();
    const debouncedValue = ref<T>(initialValue);
    
    // Only set up the debounced watcher on the client side
    if (isBrowser.value) {
      // Create a debounced function to update the value
      const debouncedUpdate = debounce((newValue: T) => {
        debouncedValue.value = newValue;
      }, wait);
      
      // Watch the getter and update the debounced value
      const stopWatcher = watch(
        () => getter(),
        (newValue) => {
          // Call the debounced update function instead of immediately updating
          debouncedUpdate(newValue);
        },
        { deep: true } // Removed immediate flag to avoid overriding the initial value
      );
      
      // Clean up the watcher and cancel any pending debounced calls when unmounted
      onUnmounted(() => {
        stopWatcher();
        debouncedUpdate.cancel();
      });
    }
    
    // If no setter provided, return a read-only computed ref
    if (!setter) {
      return computed(() => {
        // On server, return the actual value, on client use the debounced value
        return debouncedValue.value;
      });
    }
    
    // With setter, return a writable computed
    return computed({
      get: () => {
        return debouncedValue.value;
      },
      set: (value: T) => {
        if (setter) {
          setter(value);
          // Also update the local value to maintain consistency
          debouncedValue.value = value;
        }
      }
    });
  }