import { LayoutDesign } from '@/lib/signal-visualizer/core/rendering/layoutDesign.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'
import type { PositionData } from '@/lib/signal-visualizer/core/types/positionData.ts'

export class AxisLayerBaseLayout extends LayoutDesign {
    divisions: number

    constructor(sizeData: SizeData, positionData: PositionData, divisions: number) {
        super(sizeData, positionData)
        this.divisions = divisions
    }

    get yCoordinate() {
        return this.height * 0.2
    }

    xDivision(i: number) {
        return (i / this.divisions) * this.width
    }
}
