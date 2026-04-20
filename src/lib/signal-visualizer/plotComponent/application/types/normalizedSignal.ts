import type { MinMaxValues } from '@/lib/signal-visualizer/plotComponent/application/types/minMaxValues.ts'

export type NormalizedSignal = {
    values: Float32Array
    minMaxValues: MinMaxValues
}
