import type { MinMaxValues } from "@/plotComponent/application/types/minMaxValues"
import type { NormalizedSignal } from "@/plotComponent/application/types/normalizedSignal"

export class Envelope {
    static normalizeCoords(samples: Float32Array, minMaxValues?: MinMaxValues): NormalizedSignal {
        const n = samples.length
        const normalized = new Float32Array(n)
        if (minMaxValues === undefined) {
            let minValue = samples[0]!
            let maxValue = samples[0]!
            for (let i = 1; i < n; i++) {
                const next: number = samples[i]!
                minValue = Math.min(next, minValue)
                maxValue = Math.max(next, maxValue)
            }
            minMaxValues = {
                min: minValue,
                max: maxValue
            }
        }
        if (minMaxValues.max === minMaxValues.min) {
            normalized.fill(0.5)
            return {
                values: normalized,
                minMaxValues: minMaxValues
            }
        }
        for (let i = 0; i < n; i++) {
            const sample = samples[i]!
            normalized[i] = (sample - minMaxValues.min) / (minMaxValues.max - minMaxValues.min)
        }
        return {
            values: normalized,
            minMaxValues: minMaxValues
        }
    }
}
