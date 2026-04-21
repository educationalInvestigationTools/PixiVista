import type { PerformanceMetrics } from '@/lib/signal-visualizer/core/types/performanceMetrics.ts'

export type MetricsSample = {
    timestampMs: number
    renderTimeMs: number
    refreshRateFps: number
}

export function buildMetricsSample(
    performanceMetrics: PerformanceMetrics
): MetricsSample {
    return {
        timestampMs : performanceMetrics.date.getTime(),
        renderTimeMs: performanceMetrics.renderTime,
        refreshRateFps: performanceMetrics.refreshRate,
    }
}
