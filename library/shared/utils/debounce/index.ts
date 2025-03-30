/**
 * Interface for a debounced function
 */
export interface DebouncedFunction<T extends (...args: any[]) => any> {
    (...args: Parameters<T>): ReturnType<T> | undefined;
    cancel: () => void;
    flush: () => ReturnType<T> | undefined;
    pending: () => boolean;
}

/**
 * Creates a debounced function that delays invoking the provided function until after
 * the specified wait time has elapsed since the last time it was invoked.
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait = 300,
    options: { leading?: boolean; trailing?: boolean; context?: any } = {}
): DebouncedFunction<T> {
    const { leading = false, trailing = true, context = null } = options;
    let timeout: ReturnType<typeof setTimeout> | null = null;
    let result: ReturnType<T>;
    let lastArgs: Parameters<T> | null = null;
    let lastThis: any = null;
    let lastCallTime: number | null = null;
    let lastInvokeTime = 0;
    let isInvoking = false;

    // Function to determine if we should invoke the function
    const shouldInvoke = (time: number): boolean => {
        const timeSinceLastCall = time - (lastCallTime || 0);
        return (
            lastCallTime === null ||
            timeSinceLastCall >= wait ||
            timeSinceLastCall < 0
        );
    };

    // Function to actually invoke the original function
    const invokeFunc = (time: number): ReturnType<T> => {
        const args = lastArgs as Parameters<T>;
        const thisArg = lastThis;
        
        lastInvokeTime = time;
        isInvoking = true;
        
        result = func.apply(context || thisArg, args);
        
        isInvoking = false;
        return result;
    };

    // Function to handle the timeout
    const timerExpired = (): void => {
        const time = Date.now();
        
        if (shouldInvoke(time)) {
            return trailingEdge(time);
        }
        
        // Restart the timer for remaining time
        const timeSinceLastInvoke = time - lastInvokeTime;
        const timeWaiting = wait - timeSinceLastInvoke;
        
        timeout = setTimeout(timerExpired, timeWaiting);
    };

    // Function to handle the leading edge of the timeout
    const leadingEdge = (time: number): ReturnType<T> => {
        lastInvokeTime = time;
        
        // Start a timer for the trailing edge
        if (trailing) {
            timeout = setTimeout(timerExpired, wait);
        }
        
        return invokeFunc(time);
    };

    // Function to handle the trailing edge of the timeout
    const trailingEdge = (time: number): ReturnType<T> => {
        timeout = null;
        
        if (trailing && lastArgs) {
            return invokeFunc(time);
        }
        
        // Reset for next debounce
        lastArgs = null;
        lastThis = null;
        
        return result;
    };

    // The debounced function
    function debounced(this: any, ...args: Parameters<T>): ReturnType<T> | undefined {
        const time = Date.now();
        const isInvokeImmediate = shouldInvoke(time) && leading;
        
        lastArgs = args;
        lastThis = this;
        lastCallTime = time;
        
        if (isInvokeImmediate) {
            if (timeout === null) {
                return leadingEdge(lastCallTime);
            }
            
            if (trailing) {
                // Handle overlap case where we're in the middle of a trailing call
                clearTimeout(timeout);
                timeout = setTimeout(timerExpired, wait);
                return invokeFunc(lastCallTime);
            }
        }
        
        if (timeout === null && trailing) {
            timeout = setTimeout(timerExpired, wait);
        }
        
        return result;
    }

    // Cancel method to clear the timeout
    debounced.cancel = function(): void {
        if (timeout !== null) {
            clearTimeout(timeout);
            timeout = null;
        }

        lastInvokeTime = 0;
        lastArgs = null;
        lastCallTime = null;
        lastThis = null;
    };

    // Flush method to immediately invoke the function if it's being debounced
    debounced.flush = function(): ReturnType<T> | undefined {
        if (timeout !== null) {
            const result = trailingEdge(Date.now());
            return result;
        }

        return undefined;
    };

    // Method to check if the debounced function is pending
    debounced.pending = function(): boolean {
            return timeout !== null;
    };

    return debounced as DebouncedFunction<T>;
}