import { LayoutDesign } from '@/lib/signal-visualizer/core/rendering/layoutDesign.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'
import type { PositionData } from '@/lib/signal-visualizer/core/types/positionData.ts'

export class ComponentBaseLayout extends LayoutDesign {
    constructor(sizeData: SizeData, positionData: PositionData) {
        super(sizeData, positionData)
    }

    get marginVerticalLeft(): number {
        return this.width * 0.05
    }

    get marginVerticalRight(): number {
        return this.width * 0.05
    }

    get xLeft(): number {
        return this.marginVerticalLeft
    }

    get xRight(): number {
        return this.width - this.marginVerticalRight
    }

    get widthAfterMargin(): number {
        return this.xRight - this.xLeft
    }
}
