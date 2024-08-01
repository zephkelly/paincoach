export default function debounce(func: any, timeout: any) {
    let timeoutId: any;
    return (...args: any) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func(...args);
        }, timeout);
    };
}