import type { PerformanceMetrics } from '@/lib/signal-visualizer/core/types/performanceMetrics.ts'

export type MetricsSample = {
    timestampMs: number
    renderTimeMs: number
    refreshRateFps: number
}

export function buildMetricsSample(
    performanceMetrics: PerformanceMetrics,
    timestampMs: number,
): MetricsSample {
    return {
        timestampMs,
        renderTimeMs: performanceMetrics.renderTime,
        refreshRateFps: performanceMetrics.refreshRate,
    }
}
