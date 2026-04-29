import { LayoutDesign } from '@/lib/signal-visualizer/core/rendering/layoutDesign.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'
import type { PositionData } from '@/lib/signal-visualizer/core/types/positionData.ts'

export class MetricsChartLayout extends LayoutDesign {
    private static readonly HEADER_TOP = 2

    get panelPaddingX() {
        return Math.max(8, this.width * 0.025)
    }

    get panelPaddingTop() {
        return Math.max(6, this.height * 0.05)
    }

    get panelPaddingBottom() {
        return Math.max(18, this.height * 0.14)
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

    get headerHeight() {
        return Math.max(this.plotY - MetricsChartLayout.HEADER_TOP, 1)
    }

    get headerTop() {
        return MetricsChartLayout.HEADER_TOP
    }

    public buildTitleLabelPositionData(): PositionData {
        return {
            x: this.plotX,
            y: this.headerTop,
        }
    }
    public buildPlotSizeData(): SizeData {
        return {
            width: this.plotWidth,
            height: this.plotHeight,
        }
    }

    public buildPlotPositionData(): PositionData {
        return {
            x: this.plotX,
            y: this.plotY,
        }
    }
}
