import {ViewPort} from "@/lib/signal-visualizer/application/SignalSource.ts";
import type {AxisSignal} from "@/lib/signal-visualizer/core/axis-signal.ts";

export class OneDimSignals {
    viewPort: ViewPort
    channels: OneDimSignal[]

    constructor(viewPort: ViewPort, signals: OneDimSignal[]) {
        this.viewPort = viewPort
        this.channels = signals
    }

    get totalSignals() : number {
        return this.channels.length
    }
}

export type OneDimSignal = {
    xSignal: AxisSignal
    ySignal: AxisSignal
}

export type RenderModel = {
    width: number;
    height: number;
    oneDimSignals: OneDimSignals
    readonly horizontalDivisions: number
    readonly verticalDivisions: number
}
