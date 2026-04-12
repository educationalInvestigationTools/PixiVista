export function fmtTime(seconds: number, extended: boolean): string {
    if (!extended) {
        if (seconds < 60) return `${seconds}s`
        if (seconds < 3600)
            return seconds % 60 === 0 ? `${seconds / 60}min` : `${(seconds / 60).toFixed(1)}min`
        return seconds % 3600 === 0 ? `${seconds / 3600}h` : `${(seconds / 3600).toFixed(1)}h`
    } else {
        const s = Math.floor(seconds)
        const hours = Math.floor(s / 3600)
        const minutes = Math.floor((s % 3600) / 60)
        const secs = s % 60

        const hh = String(hours).padStart(2, '0')
        const mm = String(minutes).padStart(2, '0')
        const ss = String(secs).padStart(2, '0')

        return `${hh}:${mm}:${ss}`
    }
}

export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function sameSet<T>(one: Array<T>, two: Array<T>) {
    const set1 = new Set(one)
    const set2 = new Set(two)

    if (set1.size !== set2.size) {
        return false
    }

    for (const item of set1) {
        if (!set2.has(item)) {
            return false
        }
    }
    return true
}
