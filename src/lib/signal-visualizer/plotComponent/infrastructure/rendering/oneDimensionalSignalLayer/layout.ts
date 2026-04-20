import { LayoutDesign } from '@/lib/signal-visualizer/core/rendering/layoutDesign.ts'
import type { PositionData } from '@/lib/signal-visualizer/core/types/positionData.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'
import type { OneDimNormalizedSignal } from '@/lib/signal-visualizer/plotComponent/application/types/oneDimNormalizedSignal.ts'

export class OneDimensionalSignalLayout extends LayoutDesign {
    signalData: OneDimNormalizedSignal

    constructor(sizeData: SizeData, posData: PositionData, signalData: OneDimNormalizedSignal) {
        super(sizeData, posData)
        this.signalData = signalData
    }
}
