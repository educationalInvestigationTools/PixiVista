import { GridBaseLayout } from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/gridLayer/gridBaseLayout.ts'
import type { MinMaxValues } from '@/lib/signal-visualizer/plotComponent/application/types/minMaxValues.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'
import type { PositionData } from '@/lib/signal-visualizer/core/types/positionData.ts'
import type { GridData } from '@/lib/signal-visualizer/plotComponent/application/types/gridData.ts'
import { LabelsAxisLayerLayout } from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/axisLayer/labelsAxisLayerLayout.ts'
import type {
    GridLabelFormatter,
    VerticalLabelsBuildData,
    VerticalLabelsSide,
} from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/gridLayer/layouts.ts'

export class GridLabelsLayout extends GridBaseLayout {
    minMaxValues: MinMaxValues
    private readonly side: VerticalLabelsSide
    private readonly formatter: GridLabelFormatter

    constructor(
        sizeData: SizeData,
        posData: PositionData,
        gridData: GridData,
        buildData: VerticalLabelsBuildData,
    ) {
        super(sizeData, posData, gridData)
        this.minMaxValues = buildData.minMaxValues
        this.side = buildData.side
        this.formatter = buildData.formatter
    }

    get stepSize() {
        return (this.minMaxValues.max - this.minMaxValues.min) / this.horizontalDivisions
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

    get labelWidthAvailable(): number {
        // Channels use 5% horizontal margins on each side in the parent layout.
        return Math.max(this.width / 18, this.minFontSize * 2)
    }

    get maxLabelHeightAvailable(): number {
        const labelCount = Math.max(this.horizontalDivisions + 1, 1)
        return Math.max((this.height - this.edgeMargin * 2) / labelCount, 1)
    }

    fittedFontSize(maxLabelWidthAtBaseFont: number, maxLabelHeightAtBaseFont: number): number {
        const availableWidth = Math.max(this.labelWidthAvailable - this.labelToGridGap, 1)

        const widthScale =
            maxLabelWidthAtBaseFont > 0 ? availableWidth / maxLabelWidthAtBaseFont : 1
        const heightScale =
            maxLabelHeightAtBaseFont > 0
                ? this.maxLabelHeightAvailable / maxLabelHeightAtBaseFont
                : 1

        const constrainedScale = Math.min(1, widthScale, heightScale)
        const scaledSize = Math.floor(this.fontSize * constrainedScale)
        return Math.max(this.minFontSize, scaledSize)
    }

    get edgeMargin(): number {
        return 2
    }

    textXPosition(labelWidth: number): number {
        if (this.side === 'left') {
            return -(this.labelToGridGap + labelWidth)
        }
        return this.width + this.labelToGridGap
    }

    textYPosition(i: number, labelHeight: number): number {
        const halfLabelHeight = labelHeight / 2
        const edgePadding = this.edgeMargin
        const margin = halfLabelHeight + edgePadding
        const usableHeight = Math.max(this.height - margin * 2, 0)

        if (this.horizontalDivisions <= 0) {
            return this.height / 2 - halfLabelHeight
        }

        return margin + (i / this.horizontalDivisions) * usableHeight - halfLabelHeight
    }
}
