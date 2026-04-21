import { LayoutDesign } from '@/lib/signal-visualizer/core/rendering/layoutDesign.ts'
import { LabelsAxisLayerLayout } from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/axisLayer/layouts.ts'
import type { PositionData } from '@/lib/signal-visualizer/core/types/positionData.ts'
import type { MinMaxValues } from '@/lib/signal-visualizer/plotComponent/application/types/minMaxValues.ts'
import type { GridData } from '@/lib/signal-visualizer/plotComponent/application/types/gridData.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'

export type VerticalLabelsSide = 'left' | 'right'
export type HorizontalLabelsSide = 'up' | 'down'
export type GridLabelFormatter = (value: number) => string

export type VerticalLabelsBuildData = {
    minMaxValues: MinMaxValues
    side: VerticalLabelsSide
    formatter: GridLabelFormatter
}

export type HorizontalLabelsBuildData = {
    minMaxValues: MinMaxValues
    side: HorizontalLabelsSide
    formatter: GridLabelFormatter
}

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

export class GridLayout extends GridBaseLayout {
    buildVerticalGridLabelsSize(): SizeData {
        return {
            width: this.width,
            height: this.height,
        }
    }

    buildVerticalGridLabelsPos(): PositionData {
        return {
            x: 0,
            y: 0,
        }
    }

    buildHorizontalGridLabelsSize(): SizeData {
        return {
            width: this.width,
            height: this.height,
        }
    }

    buildHorizontalGridLabelsPos(): PositionData {
        return {
            x: 0,
            y: 0,
        }
    }

    buildGridLabelsSize(): SizeData {
        return this.buildVerticalGridLabelsSize()
    }

    buildGridLabelsPos(): PositionData {
        return this.buildVerticalGridLabelsPos()
    }
}
