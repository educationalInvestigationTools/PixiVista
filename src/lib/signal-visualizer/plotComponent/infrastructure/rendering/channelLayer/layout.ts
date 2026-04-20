import { LayoutDesign } from '@/lib/signal-visualizer/core/rendering/layoutDesign.ts'
import type { PositionData } from '@/lib/signal-visualizer/core/types/positionData.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'

export class ChannelLayout extends LayoutDesign {
    label: string

    constructor(sizeData: SizeData, posData: PositionData, label: string) {
        super(sizeData, posData)
        this.label = label
    }
}
