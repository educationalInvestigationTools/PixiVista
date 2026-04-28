import { LayoutDesign } from '@/lib/signal-visualizer/core/rendering/layoutDesign.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'
import type { PositionData } from '@/lib/signal-visualizer/core/types/positionData.ts'

export class MetricsChartLayout extends LayoutDesign {
    private static readonly HEADER_GAP = 6
    private static readonly HEADER_TOP = 2
    private static readonly DEFAULT_VALUE_TEXT_LENGTH = 12
    private static readonly VALUE_LABEL_MIN_WIDTH = 56
    private static readonly VALUE_LABEL_MAX_WIDTH_RATIO = 0.35
    private static readonly VALUE_LABEL_CHAR_WIDTH_FACTOR = 0.62

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
    get headerHeight() {
        return Math.max(this.plotY - MetricsChartLayout.HEADER_TOP, 1)
    }

    get headerTop() {
        return MetricsChartLayout.HEADER_TOP
    }

    get headerGap() {
        return Math.max(MetricsChartLayout.HEADER_GAP, this.plotWidth * 0.02)
    }

    getHeaderGapForWidth(availableWidth: number) {
        return Math.max(MetricsChartLayout.HEADER_GAP, availableWidth * 0.02)
    }

    public buildTitleLabelSizeData(
        valueTextLength: number = MetricsChartLayout.DEFAULT_VALUE_TEXT_LENGTH,
    ): SizeData {
        const valueLabelWidth = this.buildValueLabelWidth(valueTextLength)
        return {
            width: Math.max(this.plotWidth - valueLabelWidth - this.headerGap, 1),
            height: this.headerHeight,
        }
    }

    public buildTitleLabelSizeDataForWidth(
        valueTextLength: number,
        availableWidth: number,
    ): SizeData {
        const gap = this.getHeaderGapForWidth(availableWidth)
        const valueLabelWidth = this.buildValueLabelWidthForWidth(valueTextLength, availableWidth)
        return {
            width: Math.max(availableWidth - valueLabelWidth - gap, 1),
            height: this.headerHeight,
        }
    }

    public buildTitleLabelPositionData(): PositionData {
        return {
            x: this.plotX,
            y: this.headerTop,
        }
    }

    public buildTitleLabelPositionDataAt(leftX: number): PositionData {
        return {
            x: leftX,
            y: this.headerTop,
        }
    }

    public buildValueLabelSizeData(
        valueTextLength: number = MetricsChartLayout.DEFAULT_VALUE_TEXT_LENGTH,
    ): SizeData {
        return {
            width: this.buildValueLabelWidth(valueTextLength),
            height: this.headerHeight,
        }
    }

    public buildValueLabelSizeDataForWidth(
        valueTextLength: number,
        availableWidth: number,
    ): SizeData {
        return {
            width: this.buildValueLabelWidthForWidth(valueTextLength, availableWidth),
            height: this.headerHeight,
        }
    }

    public buildValueLabelPositionData(
        valueTextLength: number = MetricsChartLayout.DEFAULT_VALUE_TEXT_LENGTH,
    ): PositionData {
        const valueLabelWidth = this.buildValueLabelWidth(valueTextLength)
        return {
            x: this.plotRight - valueLabelWidth,
            y: this.headerTop,
        }
    }

    public buildValueLabelPositionDataAt(
        leftX: number,
        availableWidth: number,
        valueTextLength: number,
    ): PositionData {
        const valueLabelWidth = this.buildValueLabelWidthForWidth(valueTextLength, availableWidth)
        return {
            x: leftX + availableWidth - valueLabelWidth,
            y: this.headerTop,
        }
    }

    private buildValueLabelWidth(valueTextLength: number): number {
        return this.buildValueLabelWidthForWidth(valueTextLength, this.plotWidth)
    }

    private buildValueLabelWidthForWidth(valueTextLength: number, availableWidth: number): number {
        const normalizedLength = Math.max(1, valueTextLength)
        const estimatedTextWidth =
            normalizedLength *
            this.estimatedValueFontSize *
            MetricsChartLayout.VALUE_LABEL_CHAR_WIDTH_FACTOR
        const paddedEstimatedWidth = estimatedTextWidth + this.getHeaderGapForWidth(availableWidth) * 2

        const maxWidth = Math.max(
            availableWidth * MetricsChartLayout.VALUE_LABEL_MAX_WIDTH_RATIO,
            MetricsChartLayout.VALUE_LABEL_MIN_WIDTH,
        )
        return Math.max(
            MetricsChartLayout.VALUE_LABEL_MIN_WIDTH,
            Math.min(maxWidth, paddedEstimatedWidth),
        )
    }

    private get estimatedValueFontSize(): number {
        return Math.max(11, Math.floor(this.height * 0.12))
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
