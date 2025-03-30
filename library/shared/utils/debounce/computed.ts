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
): ComputedRef<T | null> | WritableComputedRef<T | null> {
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
  const debouncedValue = ref<T | null>(null);

  // Only set up the watcher on the client side
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
      { immediate: true, deep: true }
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
      // On server or initial client load, return null
      // After hydration, use the debounced value
      return isBrowser.value ? debouncedValue.value : null;
    });
  }

  // With setter, return a writable computed
  return computed({
    get: () => {
      return isBrowser.value ? debouncedValue.value : null;
    },
    set: (value: T) => {
      if (setter && value !== null) {
        setter(value);
      }
    }
  });
}   