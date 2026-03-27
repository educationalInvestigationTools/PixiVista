export function fmtTime(seconds: number): string {
    if (seconds < 60) return `${seconds}s`
    if (seconds < 3600)
        return seconds % 60 === 0 ? `${seconds / 60}min` : `${(seconds / 60).toFixed(1)}min`
    return seconds % 3600 === 0 ? `${seconds / 3600}h` : `${(seconds / 3600).toFixed(1)}h`
}
