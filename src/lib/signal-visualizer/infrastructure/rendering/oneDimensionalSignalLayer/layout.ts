import { LayoutDesign } from '@/lib/signal-visualizer/infrastructure/rendering/core/layoutDesign.ts'
import type { OneDimSignal, PositionData, SizeData } from '@/lib/signal-visualizer/core/types.ts'

export class OneDimensionalSignalLayout extends LayoutDesign {
    signalData: OneDimSignal

    constructor(sizeData: SizeData, posData: PositionData, signalData: OneDimSignal) {
        super(sizeData, posData)
        this.signalData = signalData
    }
}
