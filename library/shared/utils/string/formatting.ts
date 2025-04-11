export function capitaliseFirstLetter(string?: string): string {
    if (!string) {
        return '';
    }

    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getFirstLetter(string?: string): string {
    if (!string) {
        return '';
    }

    return string.charAt(0);
}