import type {
    ChartValuePoint
} from "@/lib/signal-visualizer/metricsComponent/infrastructure/rendering/chartLayer/types/chartValuePoint.ts";

export type PointsData = {
    points : ChartValuePoint[]
    minValue : number
    maxValue : number
    currentValue : number
}
