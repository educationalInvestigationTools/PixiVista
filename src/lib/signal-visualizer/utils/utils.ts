export class Envelope {
    minValues: Float32Array
    maxValues: Float32Array

    constructor(minValues: Float32Array, maxValues: Float32Array) {
        this.maxValues = maxValues
        this.minValues = minValues
    }
}

export function computeEnvelope(array: Float32Array) {
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

    return new Envelope(minValues, maxValues)
}

export function normalizeCoords(samples: Float32Array): Float32Array {
    const xEnvelope = computeEnvelope(samples)
    const n = samples.length
    const xMin = xEnvelope.minValues[n - 1]!
    const xMax = xEnvelope.maxValues[n - 1]!
    const normalized = new Float32Array(n)
    for (let i = 0; i < n; i++) {
        const sample = samples[i]!
        normalized[i] = (sample - xMin) / (xMax - xMin)
    }
    return normalized
}
