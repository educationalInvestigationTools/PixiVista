import type { PerformanceMetrics } from "@/core/types/performanceMetrics"
import type { EventToMediate } from "@/utils/eventMediator"


export const AddPerformanceMetricsCommandEventLabel = 'AddPerformanceMetricsCommandEventLabel'

export class AddPerformanceMetricsCommand implements EventToMediate {
    eventLabel: string = AddPerformanceMetricsCommandEventLabel
    readonly performanceMetrics: PerformanceMetrics

    constructor(performanceMetrics: PerformanceMetrics) {
        this.performanceMetrics = performanceMetrics
    }
}
