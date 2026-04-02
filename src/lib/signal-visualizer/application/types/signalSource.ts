import { ViewPort } from '@/lib/signal-visualizer/application/types/viewPort.ts'

export type OneDimSignalRaw = {
    xValues: Float32Array
    yValues: Float32Array
}

export interface SignalSource {
    readonly totalSeconds: number
    readonly label: string
    read(viewport: ViewPort): OneDimSignalRaw | Promise<OneDimSignalRaw>
}
