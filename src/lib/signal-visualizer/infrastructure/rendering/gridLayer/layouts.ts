import { LayoutDesign } from '@/lib/signal-visualizer/core/rendering/layoutDesign.ts'
import { LabelsAxisLayerLayout } from '@/lib/signal-visualizer/infrastructure/rendering/axisLayer/layouts.ts'
import type {
    GridData,
    MinMaxValues,
    PositionData,
    SizeData,
} from '@/lib/signal-visualizer/core/types.ts'

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
        return (this.minMaxValues.max - i * this.stepSize).toPrecision(2)
    }

    get fontSize(): number {
        return LabelsAxisLayerLayout.LABEL_FONT_SIZE
    }

    get edgeMargin(): number {
        return this.fontSize
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
