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
