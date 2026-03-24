import type { MinMaxValues } from '@/lib/signal-visualizer/infrastructure/rendering/minMaxValues.ts'

export type AxisSignal = {
    valuesNormalized: Float32Array
    minMaxValues: MinMaxValues
}
