import { LayoutDesign } from '@/lib/signal-visualizer/core/rendering/layoutDesign.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'
import type { PositionData } from '@/lib/signal-visualizer/core/types/positionData.ts'

export class OneDimensionalSignalLayout extends LayoutDesign {

    constructor(sizeData: SizeData, posData: PositionData) {
        super(sizeData, posData)
    }
}
