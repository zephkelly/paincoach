import { debounce, type DebouncedFunction } from '.'; // Assuming your debounce function is in a separate file



export interface DebouncedComputedOptions {
    wait?: number;
    leading?: boolean;
    trailing?: boolean;
    context?: any;
  }
  
  export interface DebouncedComputedRef<T> extends Ref<T> {
    cancel: () => void;
    flush: () => T | undefined;
    pending: () => boolean;
  }
  
  /**
   * Creates a debounced computed property that only recalculates after the debounce period
   * when its dependencies change, not immediately.
   * 
   * @param getter - The function that returns the computed value
   * @param deps - Array of reactive dependencies to watch
   * @param options - Debounce options
   * @returns A ref with debounce controls
   */
  export function debouncedComputed<T, D extends Array<any>>(
    getter: () => T,
    deps: D,
    options: DebouncedComputedOptions = {}
  ): DebouncedComputedRef<T> {
    const { wait = 300, leading = false, trailing = true, context = null } = options;
    
    // Create a ref to store the result
    const result = shallowRef(getter()) as Ref<T>;
    
    // Create the debounced calculation function
    const debouncedCalculation = debounce(() => {
      // Only execute the getter function after the debounce period
      result.value = getter();
    }, wait, { leading, trailing, context });
    
    // Watch the dependencies array
    watch(deps, () => {
      // When deps change, schedule the recalculation
      debouncedCalculation();
    }, { deep: true });
    
    // Create the debounced ref with additional methods
    const debouncedRef = ref(result) as unknown as DebouncedComputedRef<T>;
    
    // Add debounce control methods
    debouncedRef.cancel = () => {
      debouncedCalculation.cancel();
    };
    
    debouncedRef.flush = () => {
      debouncedCalculation.flush();
      return result.value;
    };
    
    debouncedRef.pending = debouncedCalculation.pending;
    
    return debouncedRef;
}