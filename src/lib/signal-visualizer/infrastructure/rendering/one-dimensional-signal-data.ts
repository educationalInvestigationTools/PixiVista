import type {AxisSignal} from "@/lib/signal-visualizer/core/axis-signal.ts";

export class OneDimensionalSignalData {
    xPart: AxisSignal
    yPart: AxisSignal

    constructor(xPart: AxisSignal, yPart: AxisSignal) {
        this.xPart = xPart
        this.yPart = yPart
    }
}
