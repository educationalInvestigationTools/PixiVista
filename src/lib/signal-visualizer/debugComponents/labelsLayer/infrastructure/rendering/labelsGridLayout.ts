import { LayoutDesign } from '@/lib/signal-visualizer/core/rendering/layoutDesign.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'
import type { PositionData } from '@/lib/signal-visualizer/core/types/positionData.ts'

import type { GridDescription } from '@/lib/signal-visualizer/debugComponents/labelsLayer/domain/types/gridDescription.ts'

export class LabelsGridLayout extends LayoutDesign {
    gridDescription: GridDescription
    constructor(sizeData: SizeData, posData: PositionData, gridDescription: GridDescription) {
        super(sizeData, posData)
        this.gridDescription = gridDescription
    }
    buildLabelSize(row: number): SizeData {
        return {
            height: this.height / this.gridDescription.columnsPerRow.length,
            width: this.width / this.gridDescription.columnsPerRow[row]!,
        }
    }

    buildLabelPosition(row: number, column: number): PositionData {
        const sizeData = this.buildLabelSize(row)
        return {
            x: column * sizeData.width,
            y: row * sizeData.height,
        }
    }
}
