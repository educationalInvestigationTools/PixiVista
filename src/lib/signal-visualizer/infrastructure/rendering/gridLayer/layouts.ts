import { LayoutDesign } from '@/lib/signal-visualizer/infrastructure/rendering/core/layoutDesign.ts'
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

    textYPosition(i: number) {
        const yDivision = (i / this.horizontalDivisions) * this.height
        return yDivision
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
