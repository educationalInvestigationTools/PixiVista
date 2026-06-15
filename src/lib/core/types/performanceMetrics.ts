import type { SizeData } from '@/core/types/sizeData'

export type PerformanceMetrics = {
    renderTimeMs: number
    sizeData: SizeData
    resolution: number
    refreshRateFps: number
    observedAt : Date
}
