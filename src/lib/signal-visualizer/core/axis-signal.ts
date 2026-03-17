import type {
    MinMaxValues
} from "@/lib/signal-visualizer/infrastructure/rendering/min-max-values.ts";

export type AxisSignal = {
    valuesNormalized: Float32Array
    minMaxValues: MinMaxValues
}
