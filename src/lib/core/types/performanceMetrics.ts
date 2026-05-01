import type { SizeData } from '@/core/types/sizeData'

export type PerformanceMetrics = {
    renderTimeMs: number
    sizeData: SizeData
    windowDevicePixelRatio: number
    refreshRateFps: number
    observedAt : Date
}
