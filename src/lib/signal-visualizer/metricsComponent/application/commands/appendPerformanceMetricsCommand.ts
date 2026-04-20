import type { PerformanceMetrics } from '@/lib/signal-visualizer/core/types/performanceMetrics.ts'
import type { EventToMediate } from '@/lib/signal-visualizer/utils/eventMediator.ts'

export const AppendPerformanceMetricsCommandEventLabel = 'AppendPerformanceMetricsCommandEventLabel'

export class AppendPerformanceMetricsCommand implements EventToMediate {
    readonly eventLabel: string = AppendPerformanceMetricsCommandEventLabel
    readonly performanceMetrics: PerformanceMetrics
    readonly timestampMs: number

    constructor(performanceMetrics: PerformanceMetrics, timestampMs?: number) {
        this.performanceMetrics = performanceMetrics
        this.timestampMs =
            timestampMs !== undefined
                ? timestampMs
                : typeof performance !== 'undefined'
                  ? performance.now()
                  : Date.now()
    }
}
