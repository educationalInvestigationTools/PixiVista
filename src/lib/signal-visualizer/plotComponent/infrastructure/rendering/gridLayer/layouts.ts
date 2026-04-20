import { LayoutDesign } from '@/lib/signal-visualizer/core/rendering/layoutDesign.ts'
import { LabelsAxisLayerLayout } from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/axisLayer/layouts.ts'
import type { PositionData } from '@/lib/signal-visualizer/core/types/positionData.ts'
import type { MinMaxValues } from '@/lib/signal-visualizer/plotComponent/application/types/minMaxValues.ts'
import type { GridData } from '@/lib/signal-visualizer/plotComponent/application/types/gridData.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'

export class GridBaseLayout extends LayoutDesign {
    private gridData: GridData

    get horizontalDivisions(): number {
        return this.gridData.horizontalDivisions
    }

    get verticalDivisions(): number {
        return this.gridData.verticalDivisions
    }

    constructor(sizeData: SizeData, posData: PositionData, gridData: GridData) {
        super(sizeData, posData)
        this.gridData = gridData
    }
}

export class GridLabelsLayout extends GridBaseLayout {
    minMaxValues: MinMaxValues

    constructor(
        sizeData: SizeData,
        posData: PositionData,
        gridData: GridData,
        minMaxValues: MinMaxValues,
    ) {
        super(sizeData, posData, gridData)
        this.minMaxValues = minMaxValues
    }

    get stepSize() {
        return (this.minMaxValues.max - this.minMaxValues.min) / this.horizontalDivisions
    }

    textLabel(i: number): string {
        return (this.minMaxValues.max - i * this.stepSize).toFixed(2)
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

export class GridLayout extends GridBaseLayout {
    buildGridLabelsSize(): SizeData {
        return {
            width: this.width,
            height: this.height,
        }
    }

    buildGridLabelsPos(): PositionData {
        return {
            x: 0,
            y: 0,
        }
    }
}
