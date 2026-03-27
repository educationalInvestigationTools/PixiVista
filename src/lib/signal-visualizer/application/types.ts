import type { SizeData } from "../core/types"

export type PerformanceMetrics = {
    renderTime: number // Updated every time that Pixi does a rendering
    sizeData: SizeData
    refreshRate : number
}
