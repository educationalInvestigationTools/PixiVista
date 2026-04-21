import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'

export type PerformanceMetrics = {
    renderTime: number
    sizeData: SizeData
    windowDevicePixelRatio: number
    refreshRate: number
    date : Date
}
