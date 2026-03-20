import { ViewPort } from '@/lib/signal-visualizer/application/SignalSource.ts'
import type { AxisSignal } from '@/lib/signal-visualizer/core/axis-signal.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/size-data.ts'
import type { GridData } from '@/lib/signal-visualizer/core/grid-data.ts'

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
    xSignal: AxisSignal
    ySignal: AxisSignal
}

export type RenderModel = {
    sizeData: SizeData
    oneDimSignals: OneDimSignals
    gridData: GridData
}
