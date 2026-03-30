import { LayoutDesign } from '@/lib/signal-visualizer/core/rendering/layoutDesign.ts'
import type { OneDimNormalizedSignal, PositionData, SizeData } from '@/lib/signal-visualizer/core/types.ts'

export class OneDimensionalSignalLayout extends LayoutDesign {
    signalData: OneDimNormalizedSignal

    constructor(sizeData: SizeData, posData: PositionData, signalData: OneDimNormalizedSignal) {
        super(sizeData, posData)
        this.signalData = signalData
    }
}
