import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'

export type PerformanceMetrics = {
    renderTimeMs: number
    sizeData: SizeData
    windowDevicePixelRatio: number
    refreshRateFps: number
    observedAt : Date
}
