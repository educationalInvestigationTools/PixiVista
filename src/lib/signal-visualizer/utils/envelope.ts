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
        const n = array.length
        const minValues = new Float32Array(n)
        const maxValues = new Float32Array(n)

        if (n > 0) {
            minValues[0] = array[0]!
            for (let i = 1; i < n; i++) {
                const next: number = array[i]!
                minValues[i] = Math.min(next, minValues[i - 1]!)
                maxValues[i] = Math.max(next, maxValues[i - 1]!)
            }
        }
        this.maxValues = maxValues
        this.minValues = minValues
        this.normalized = this.normalizeCoords(this.array, this.min, this.max)
    }

    private normalizeCoords(samples: Float32Array, min: number, max: number): Float32Array {
        const n = samples.length
        const normalized = new Float32Array(n)
        for (let i = 0; i < n; i++) {
            const sample = samples[i]!
            normalized[i] = (sample - min) / (max - min)
        }
        return normalized
    }
}
