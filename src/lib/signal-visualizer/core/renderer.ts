import { ViewPort } from '@/lib/signal-visualizer/application/signalSource.ts'
import type { OneDimSignal } from '@/lib/signal-visualizer/core/types.ts'

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
