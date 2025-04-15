export function cubicBezier(x1: number, y1: number, x2: number, y2: number, t: number): number {
    const cx = 3 * x1;
    const bx = 3 * (x2 - x1) - cx;
    const ax = 1 - cx - bx;
    
    const cy = 3 * y1;
    const by = 3 * (y2 - y1) - cy;
    const ay = 1 - cy - by;
    
    let x = t, i = 0;
    while (i < 5) {
        const xTm = x * (cx + x * (bx + x * ax));
        if (Math.abs(xTm - t) < 0.001) break;
        x = x - (xTm - t) / (cx + x * (2 * bx + 3 * ax * x));
        i++;
    }
    
    return x * (cy + x * (by + x * ay));
};