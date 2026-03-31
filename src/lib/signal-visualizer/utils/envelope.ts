import type { MinMaxValues } from '../core/types'

export class Envelope {
    minMaxValues: MinMaxValues
    normalized: Float32Array
    array: Float32Array

    get min() {
        return this.minMaxValues.min
    }

    get max() {
        return this.minMaxValues.max
    }

    constructor(array: Float32Array, minMaxValues?: MinMaxValues) {
        if (array.length == 0) {
            array = new Float32Array(0)
        }
        this.array = array
        const n = array.length

        if (minMaxValues === undefined) {
            let minValue = this.array[0]!
            let maxValue = this.array[0]!
            for (let i = 1; i < n; i++) {
                const next: number = this.array[i]!
                minValue = Math.min(next, minValue)
                maxValue = Math.max(next, maxValue)
            }
            this.minMaxValues = {
                min: minValue,
                max: maxValue,
            }
        } else {
            this.minMaxValues = minMaxValues
        }
        this.normalized = this.normalizeCoords(this.array, this.minMaxValues)
    }

    private normalizeCoords(samples: Float32Array, minMaxValues: MinMaxValues): Float32Array {
        const n = samples.length
        const normalized = new Float32Array(n)
        for (let i = 0; i < n; i++) {
            const sample = samples[i]!
            normalized[i] = (sample - minMaxValues.min) / (minMaxValues.max - minMaxValues.min)
        }
        return normalized
    }
}
