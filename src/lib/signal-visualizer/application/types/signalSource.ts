import type { ViewPort } from "./viewPort"

export type OneDimSignalRaw = {
    xValues: Float32Array
    yValues: Float32Array
}

export type SignalSourceBuildData = {
    readonly signalSourceType: string
    readonly totalSeconds: number
    readonly label: string
}

export interface SignalSourceBuilder<T extends SignalSourceBuildData> {
    build(buildData: T): SignalSource
}

export interface SignalSource {
    label: string
    read(viewport: ViewPort): OneDimSignalRaw | Promise<OneDimSignalRaw>
}
