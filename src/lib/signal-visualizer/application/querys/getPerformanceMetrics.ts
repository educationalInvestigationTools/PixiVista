import type { EventToMediate } from '../../utils/eventMediator.ts'
import type { PerformanceMetrics } from '../../core/types/performanceMetrics.ts'

export const GetPerformanceMetricsEventLabel = 'GetPerformanceMetricsEventLabel'

export class GetPerformanceMetrics implements EventToMediate {
    eventLabel: string = GetPerformanceMetricsEventLabel
    performanceMetrics: PerformanceMetrics

    constructor(performanceMetrics: PerformanceMetrics) {
        this.performanceMetrics = performanceMetrics
    }
}
