import { watch, type WatchOptions } from 'vue';
import { debounce } from ".";

export interface DebouncedWatchOptions extends WatchOptions {
    wait?: number;
    leading?: boolean;
    trailing?: boolean;
    context?: any;
  }
  
  export interface DebouncedWatchController {
    stop: () => void;
    cancel: () => void;
    flush: () => void;
    pending: () => boolean;
  }
  
  /**
   * Creates a debounced watcher that only executes the callback after the debounce period
   * when its dependencies change.
   * 
   * @param deps - Array of reactive dependencies to watch
   * @param callback - Function to execute after the debounce period
   * @param options - Combined watch and debounce options
   * @returns Controller object with stop, cancel, flush and pending methods
   */
  export function debouncedWatch<T extends any[]>(
    deps: [...T],
    callback: (newValues: [...T], oldValues: [...T] | undefined) => void,
    options: DebouncedWatchOptions = {}
  ): DebouncedWatchController {
    const { 
      wait = 300, 
      leading = false, 
      trailing = true, 
      context = null,
      ...watchOptions 
    } = options;
    
    // Create debounced callback that handles the potential undefined oldValues
    const debouncedCallback = debounce(
      (newValues: [...T], oldValues: [...T] | undefined) => {
        callback(newValues, oldValues);
      }, 
      wait, 
      { leading, trailing, context }
    );
    
    // Create the watcher that triggers the debounced callback
    const stopWatcher = watch(deps, debouncedCallback, watchOptions);
    
    // Create controller with combined functionality
    const controller: DebouncedWatchController = {
      // Stop the watcher completely
      stop: () => {
        debouncedCallback.cancel();
        stopWatcher();
      },
      
      // Cancel pending debounced calls without stopping the watcher
      cancel: () => {
        debouncedCallback.cancel();
      },
      
      // Immediately execute pending callback
      flush: () => {
        debouncedCallback.flush();
      },
      
      // Check if there's a pending callback
      pending: debouncedCallback.pending
    };
    
    return controller;
  }