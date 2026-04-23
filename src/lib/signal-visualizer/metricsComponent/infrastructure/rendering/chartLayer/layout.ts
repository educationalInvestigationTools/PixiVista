import { LayoutDesign } from '@/lib/signal-visualizer/core/rendering/layoutDesign.ts'
import type { PositionData } from '@/lib/signal-visualizer/core/types/positionData.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'

export class MetricsChartLayout extends LayoutDesign {
    private static readonly HEADER_GAP = 6
    private static readonly HEADER_TOP = 2

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

    get plotRight() {
        return this.plotX + this.plotWidth
    }

    get plotBottom() {
        return this.plotY + this.plotHeight
    }

    get headerHeight() {
        return Math.max(this.plotY - MetricsChartLayout.HEADER_TOP, 1)
    }

    get headerGap() {
        return Math.max(MetricsChartLayout.HEADER_GAP, this.plotWidth * 0.02)
    }

    get valueLabelWidth() {
        return Math.max((this.plotWidth - this.headerGap) * 0.4, 1)
    }

    get titleLabelWidth() {
        return Math.max(this.plotWidth - this.valueLabelWidth - this.headerGap, 1)
    }

    public buildTitleLabelSizeData(): SizeData {
        return {
            width: this.titleLabelWidth,
            height: this.headerHeight,
        }
    }

    public buildTitleLabelPositionData(): PositionData {
        return {
            x: this.plotX,
            y: MetricsChartLayout.HEADER_TOP,
        }
    }

    public buildValueLabelSizeData(): SizeData {
        return {
            width: this.valueLabelWidth,
            height: this.headerHeight,
        }
    }

    public buildValueLabelPositionData(): PositionData {
        return {
            x: this.plotX + this.titleLabelWidth + this.headerGap,
            y: MetricsChartLayout.HEADER_TOP,
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
