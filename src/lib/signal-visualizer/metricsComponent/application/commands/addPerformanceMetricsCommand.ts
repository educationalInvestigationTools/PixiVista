import type { PerformanceMetrics } from '@/lib/signal-visualizer/core/types/performanceMetrics.ts'
import type { EventToMediate } from '@/lib/signal-visualizer/utils/eventMediator.ts'

export const AddPerformanceMetricsCommandEventLabel = 'AddPerformanceMetricsCommandEventLabel'

export class AddPerformanceMetricsCommand implements EventToMediate {
    readonly eventLabel: string = AddPerformanceMetricsCommandEventLabel
    readonly performanceMetrics: PerformanceMetrics

    constructor(performanceMetrics: PerformanceMetrics) {
        this.performanceMetrics = performanceMetrics
    }
}
