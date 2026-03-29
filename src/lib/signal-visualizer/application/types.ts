import type { SizeData } from "../core/types"

export type PerformanceMetrics = {
    renderTime: number
    sizeData: SizeData
    windowDevicePixelRatio: number
    refreshRate : number
}
