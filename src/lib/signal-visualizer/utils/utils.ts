export class Envelope {
    minValues: Float32Array
    maxValues: Float32Array
    normalized: Float32Array
    array: Float32Array

    get length(): number {
        return this.array.length
    }

    get min() {
        return this.minValues[this.minValues.length! - 1]!
    }

    get max() {
        return this.maxValues[this.maxValues.length! - 1]!
    }

    constructor(array: Float32Array) {
        this.array = array

        const minValues = new Float32Array(array.length)
        const maxValues = new Float32Array(array.length)

        if (array.length > 0) {
            minValues[0] = array[0]!
            for (let i = 1; i < array.length; i++) {
                const next: number = array[i]!
                minValues[i] = Math.min(next, minValues[i - 1]!)
                maxValues[i] = Math.max(next, maxValues[i - 1]!)
            }
        }
        this.maxValues = maxValues
        this.minValues = minValues
        this.normalized = normalizeCoords(this.array, this.min, this.max)
    }
}

function normalizeCoords(samples: Float32Array, min: number, max: number): Float32Array {
    const n = samples.length
    const normalized = new Float32Array(n)
    for (let i = 0; i < n; i++) {
        const sample = samples[i]!
        normalized[i] = (sample - min) / (max - min)
    }
    return normalized
}
