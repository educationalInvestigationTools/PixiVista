import type {SizeData} from "../../core/types.ts"

export type PerformanceMetrics = {
    renderTime: number
    sizeData: SizeData
    windowDevicePixelRatio: number
    refreshRate: number
}
