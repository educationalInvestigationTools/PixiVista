import { LayoutDesign } from '@/lib/signal-visualizer/core/rendering/layoutDesign.ts'
import type { PositionData } from '@/lib/signal-visualizer/core/types/positionData.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'

export class MetricsChartLayout extends LayoutDesign {
    constructor(sizeData: SizeData, positionData: PositionData) {
        super(sizeData, positionData)
    }

    get panelPaddingX() {
        return Math.max(8, this.width * 0.025)
    }

    get panelPaddingTop() {
        return Math.max(6, this.height * 0.05)
    }

    get panelPaddingBottom() {
        return Math.max(10, this.height * 0.08)
    }

    get titleHeight() {
        return Math.max(16, this.height * 0.16)
    }

    get plotX() {
        return this.panelPaddingX
    }

    get plotY() {
        return this.panelPaddingTop + this.titleHeight
    }

    get plotWidth() {
        return Math.max(1, this.width - this.panelPaddingX * 2)
    }

    get plotHeight() {
        const plotBottom = this.height - this.panelPaddingBottom
        return Math.max(1, plotBottom - this.plotY)
    }

    get plotRight() {
        return this.plotX + this.plotWidth
    }

    get plotBottom() {
        return this.plotY + this.plotHeight
    }
}
