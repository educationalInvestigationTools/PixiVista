import { GridBaseLayout } from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/gridLayer/gridBaseLayout.ts'
import type { MinMaxValues } from '@/lib/signal-visualizer/plotComponent/application/types/minMaxValues.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'
import type { PositionData } from '@/lib/signal-visualizer/core/types/positionData.ts'
import type { GridData } from '@/lib/signal-visualizer/plotComponent/application/types/gridData.ts'
import { LabelsAxisLayerLayout } from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/axisLayer/labelsAxisLayerLayout.ts'
import type {
    GridLabelFormatter,
    HorizontalLabelsBuildData,
    HorizontalLabelsSide,
} from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/gridLayer/layouts.ts'

export class HorizontalGridLabelsLayout extends GridBaseLayout {
    minMaxValues: MinMaxValues
    private readonly side: HorizontalLabelsSide
    private readonly formatter: GridLabelFormatter

    constructor(
        sizeData: SizeData,
        posData: PositionData,
        gridData: GridData,
        buildData: HorizontalLabelsBuildData,
    ) {
        super(sizeData, posData, gridData)
        this.minMaxValues = buildData.minMaxValues
        this.side = buildData.side
        this.formatter = buildData.formatter
    }

    get stepSize() {
        return (this.minMaxValues.max - this.minMaxValues.min) / this.verticalDivisions
    }

    valueAt(i: number): number {
        return this.minMaxValues.max - i * this.stepSize
    }

    textLabel(i: number): string {
        return this.formatter(this.valueAt(i))
    }

    get fontSize(): number {
        return LabelsAxisLayerLayout.LABEL_FONT_SIZE
    }

    get minFontSize(): number {
        return 1
    }

    get labelToGridGap(): number {
        return Math.max(2, this.fontSize * 0.25)
    }

    get edgeMargin(): number {
        return 2
    }

    get maxLabelWidthAvailable(): number {
        const labelCount = Math.max(this.verticalDivisions + 1, 1)
        return Math.max((this.width - this.edgeMargin * 2) / labelCount, 1)
    }

    get maxLabelHeightAvailable(): number {
        return this.fontSize
    }

    fittedFontSize(maxLabelWidthAtBaseFont: number, maxLabelHeightAtBaseFont: number): number {
        const widthScale =
            maxLabelWidthAtBaseFont > 0 ? this.maxLabelWidthAvailable / maxLabelWidthAtBaseFont : 1
        const heightScale =
            maxLabelHeightAtBaseFont > 0
                ? this.maxLabelHeightAvailable / maxLabelHeightAtBaseFont
                : 1

        const constrainedScale = Math.min(1, widthScale, heightScale)
        const scaledSize = Math.floor(this.fontSize * constrainedScale)
        return Math.max(this.minFontSize, scaledSize)
    }

    textXPosition(i: number, labelWidth: number): number {
        const halfLabelWidth = labelWidth / 2
        const edgePadding = this.edgeMargin
        const margin = halfLabelWidth + edgePadding
        const usableWidth = Math.max(this.width - margin * 2, 0)

        if (this.verticalDivisions <= 0) {
            return this.width / 2 - halfLabelWidth
        }

        return margin + (i / this.verticalDivisions) * usableWidth - halfLabelWidth
    }

    textYPosition(labelHeight: number): number {
        if (this.side === 'up') {
            return -(this.labelToGridGap + labelHeight)
        }
        return this.height + this.labelToGridGap
    }
}
