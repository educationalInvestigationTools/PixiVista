import { LayoutDesign } from '@/lib/signal-visualizer/infrastructure/rendering/core/layoutDesign.ts'
import type { PositionData, SizeData } from '@/lib/signal-visualizer/core/types.ts'

export class ChannelLayout extends LayoutDesign {
    label: string

    constructor(sizeData: SizeData, posData: PositionData, label: string) {
        super(sizeData, posData)
        this.label = label
    }
}
