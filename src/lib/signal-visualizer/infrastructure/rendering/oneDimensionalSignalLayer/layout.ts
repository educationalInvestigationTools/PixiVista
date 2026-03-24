import { LayoutDesign } from '@/lib/signal-visualizer/infrastructure/rendering/core/layoutDesign.ts'
import type { OneDimensionalSignalData } from '@/lib/signal-visualizer/infrastructure/rendering/oneDimensionalSignalData.ts'
import type { PositionData, SizeData } from '@/lib/signal-visualizer/core/types.ts'

export class OneDimensionalSignalLayout extends LayoutDesign {
    signalData: OneDimensionalSignalData

    constructor(sizeData: SizeData, posData: PositionData, signalData: OneDimensionalSignalData) {
        super(sizeData, posData)
        this.signalData = signalData
    }
}
