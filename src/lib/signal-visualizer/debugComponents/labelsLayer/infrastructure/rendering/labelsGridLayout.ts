import { LayoutDesign } from '@/lib/signal-visualizer/core/rendering/layoutDesign.ts'
import type { Point2D } from '@/lib/signal-visualizer/core/types/point2D'
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'

import type { GridDescription } from '@/lib/signal-visualizer/debugComponents/labelsLayer/domain/types/gridDescription.ts'

export class LabelsGridLayout extends LayoutDesign {
    gridDescription: GridDescription
    constructor(gridDescription: GridDescription) {
        super()
        this.gridDescription = gridDescription
    }
    buildLabelSize(row: number): SizeData {
        return {
            height: this.height / this.gridDescription.columnsPerRow.length,
            width: this.width / this.gridDescription.columnsPerRow[row]!,
        }
    }

    buildLabelPosition(row: number, column: number): Point2D {
        const sizeData = this.buildLabelSize(row)
        return {
            x: column * sizeData.width,
            y: row * sizeData.height,
        }
    }
}
