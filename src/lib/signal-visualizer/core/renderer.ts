import {ViewPort} from '@/lib/signal-visualizer/application/signalSource.ts'
import type {AxisSignal, GridData, SizeData} from "@/lib/signal-visualizer/core/types.ts";

export class OneDimSignals {
    viewPort: ViewPort
    channels: OneDimSignal[]

    constructor(viewPort: ViewPort, signals: OneDimSignal[]) {
        this.viewPort = viewPort
        this.channels = signals
    }

    get totalSignals(): number {
        return this.channels.length
    }
}

export type OneDimSignal = {
    label: string
    xSignal: AxisSignal
    ySignal: AxisSignal
}

export type RenderModel = {
    sizeData: SizeData
    oneDimSignals: OneDimSignals
    gridData: GridData
}
