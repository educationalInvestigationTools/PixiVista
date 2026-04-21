import type { PerformanceMetrics } from '@/lib/signal-visualizer/core/types/performanceMetrics.ts'
import type { EventToMediate } from '@/lib/signal-visualizer/utils/eventMediator.ts'

export const AppendPerformanceMetricsCommandEventLabel = 'AppendPerformanceMetricsCommandEventLabel'

export class AppendPerformanceMetricsCommand implements EventToMediate {
    readonly eventLabel: string = AppendPerformanceMetricsCommandEventLabel
    readonly performanceMetrics: PerformanceMetrics

    constructor(performanceMetrics: PerformanceMetrics) {
        this.performanceMetrics = performanceMetrics
    }
}
