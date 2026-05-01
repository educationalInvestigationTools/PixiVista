import { LayoutDesign } from "@/core/rendering/layoutDesign"
import type { Point2D } from "@/core/types/point2D"
import type { SizeData } from "@/core/types/sizeData"
import type { GridDescription } from "@/debugComponents/labelsLayer/domain/types/gridDescription"

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
